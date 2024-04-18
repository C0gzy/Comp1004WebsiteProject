var Page = 0;
var DisplayPerPage = 100;
var CurrentDisplayedImages = [];
var Database;
var CurrentSavedFavorites = [];


window.onload = function() {
    fetch('/StarterDatabase.json').then(response => response.json()).then(data => {
        console.log(data);
        Database = data;
        UpdatePage();
    })

}

function UpdatePage(increment = 0 , WhichSet = Database) {
    Page += increment;

    if (Page < 0){ 
        Page = 0;
    }

    document.getElementById("PageNumber").innerHTML = "Page " + (Page + 1) + " of " + Math.ceil(WhichSet.length / DisplayPerPage);
    for (var i=0; i < CurrentDisplayedImages.length; i++){
        CurrentDisplayedImages[i].remove();
    }

    for (var i=(Page * DisplayPerPage); i < (Page * DisplayPerPage) + DisplayPerPage; i++){

        if (i >= WhichSet.length){
            break;
        } else if (WhichSet[i] == null){
            continue;
        }

        var FilmImage = document.createElement("div")
        var PosterImage = "Images/No_picture_available.png"
        if ((WhichSet[i].PosterImage != null ) && (WhichSet[i].PosterImage != "N/A")){
            PosterImage = WhichSet[i].PosterImage;
        }
        var ID =  WhichSet[i].tconst;
        FilmImage.innerHTML = 
        `<button class="grid-item" id="${i+ID}"> 
            
            <img class="Grid-Image" src=${PosterImage} ></img>
            
            <div hidden class="MovieDetails"> 
            <h1 class="MovieDetailsTitle">${WhichSet[i].primaryTitle}</h1>
                <div class="MovieContainer">

                <div class="MovieDetailsLeft">
                
                <img class="MovieDetailsImage" src=${PosterImage} >  
                <p class="Rating">      Rating: \n${WhichSet[i].imdbRating}</p>
                <p class="DirectorAndActors">Director: ${WhichSet[i].Director}\n Actors: ${WhichSet[i].Actors}</p>

                </div>
                <div class="MovieDetailsRight">
                <p class="MovieDetailsPlot">Release Year: ${WhichSet[i].startYear} \n \n Plot: \n ${WhichSet[i].Plot}</p>
                <input id="${ID}" type="checkbox" class="FavButton">Favourite</input>
                <p class="Genres">Genres: \n${WhichSet[i].genres}</p>
                </div>
                
                
                
                </div>
            </div> 
        </button>`

        FilmImage.onclick = moviepostclick;


        document.getElementById("FilmGrid").appendChild(FilmImage);  

        CurrentDisplayedImages.push(FilmImage);   
        document.getElementById(i+ID).addEventListener( "click" , function (event) {
            console.log(event.target.id);
            CurrentSavedFavorites.push(WhichSet.filter(a => a.tconst == event.target.id)[0]);
            console.log(CurrentSavedFavorites);
        });
    }
   
}
 
function moviepostclick(e){
    var FilmImage = e.currentTarget;
    console.log(FilmImage.getElementsByClassName("Grid-Image"));
    FilmImage.getElementsByClassName("Grid-Image")[0].hidden = !FilmImage.getElementsByClassName("Grid-Image")[0].hidden;
    FilmImage.getElementsByClassName("MovieDetails")[0].hidden = !FilmImage.getElementsByClassName("MovieDetails")[0].hidden;
}

var SearchBar = document.getElementById("SearchBar")

SearchBar.addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        Search();
    }
});

function Search(){
    var SearchTerm = SearchBar.value;
    console.log(SearchTerm);
    var FilteredDatabase = Database.filter(function (el) {
        return el.primaryTitle.toLowerCase().includes(SearchTerm.toLowerCase());
      });
    console.log(FilteredDatabase);
    Page = 0;
    UpdatePage(0 , FilteredDatabase);
}

var ActiveFilters = {
    "movie": true,
    "short": true,
    "tvSeries": true,
    "StartYear": 0,
    "imdbRating": 0
}

var FilterBar = document.getElementById("FilterBar");

function ShowFilterBar(){
    console.log(FilterBar);
    FilterBar.hidden = !FilterBar.hidden;
}

function Filter(){
    var StartYear = Database.filter(function (el) {
        return el.startYear > document.getElementById("YearInput").value;//ActiveFilters["StartYear"];
    });
    var movieFilter = StartYear.filter(function (el) {
        if (document.getElementById("movieFilter").checked == true) {
            return el.titleType == "movie";
        }else if (document.getElementById("ShortFilter").checked == true) {
            return el.titleType == "short";
        }
        return el;
    });
    Page = 0;
    UpdatePage(0 , movieFilter);
}

var ImportButton = document.getElementById("ImportButton");
ImportButton.addEventListener("change", Import);

function Import(Event){
    var ImportedFile = document.getElementById("ImportButton").files[0];
    console.log(ImportedFile);
    var reader = new FileReader();
    reader.readAsText(ImportedFile);
    reader.onload = function() {
        var NewDataBase = JSON.parse(reader.result);
        console.log(NewDataBase);
        UpdatePage(0, NewDataBase);
    };
}

function Export(){
    var textToSave = JSON.stringify(CurrentSavedFavorites);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'FavData.json';
    hiddenElement.click();
    hiddenElement.remove();
}