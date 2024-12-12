//Main global variables
var Page = 0;
var DisplayPerPage = 100;
var CurrentDisplayedImages = [];
var Database;
var CurrentSavedFavorites = [];

// When page if fully loaded request the database from the server
window.onload = function() {
    fetch('https://tomcogzell.com/SubWebs/Comp1004WebsiteProject/StarterDatabase.json').then(response => response.json()).then(data => {
        console.log(data);
        Database = data;
        UpdatePage();
    })

}

//When a change in datbase occurs or the user wants to go to a different page call this function
function UpdatePage(increment = 0 , WhichSet = Database) {
    Page += increment;

    // if the page + the increment is less than 0 set the page to 0
    if (Page < 0){ 
        Page = 0;
    }

    document.getElementById("PageNumber").innerHTML = "Page " + (Page + 1) + " of " + Math.ceil(WhichSet.length / DisplayPerPage);
    for (var i=0; i < CurrentDisplayedImages.length; i++){ //remove all old data from the page
        CurrentDisplayedImages[i].remove(); //delete all html elements
    }

    // for lopp through the data and display the data from the current page till a display max of the page
    for (var i=(Page * DisplayPerPage); i < (Page * DisplayPerPage) + DisplayPerPage; i++){ 

        // if the index is greater than the length of the data break the loop
        if (i >= WhichSet.length){
            break;
        } else if (WhichSet[i] == null){ // if the data is null skip this iteration
            continue;
        }

        // create element poster data for the film
        var FilmImage = document.createElement("div")
        var PosterImage = "Images/No_picture_available.png"
        if ((WhichSet[i].PosterImage != null ) && (WhichSet[i].PosterImage != "N/A")){
            PosterImage = WhichSet[i].PosterImage;
        }
        var ID =  WhichSet[i].tconst; // ID for the film
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

        FilmImage.onclick = moviepostclick; // asign the onclick function to the div


        document.getElementById("FilmGrid").appendChild(FilmImage);   // add the div to the page

        CurrentDisplayedImages.push(FilmImage);   // push the div to the current displayed images
        document.getElementById(i+ID).addEventListener( "click" , function (event) { //add the favourite function to the fav button
            console.log(event.target.id);
            CurrentSavedFavorites.push(WhichSet.filter(a => a.tconst == event.target.id)[0]);
            console.log(CurrentSavedFavorites);
        });
    }
   
}
 
//when movie poster is clicked show the movie details and hide the poster
function moviepostclick(e){
    var FilmImage = e.currentTarget;
    console.log(FilmImage.getElementsByClassName("Grid-Image"));
    FilmImage.getElementsByClassName("Grid-Image")[0].hidden = !FilmImage.getElementsByClassName("Grid-Image")[0].hidden;
    FilmImage.getElementsByClassName("MovieDetails")[0].hidden = !FilmImage.getElementsByClassName("MovieDetails")[0].hidden;
}

var SearchBar = document.getElementById("SearchBar")

// WHen the enter key is pressed in the search bar call the search function
SearchBar.addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        Search();
    }
});

// When the search button is clicked call the search function
function Search(){
    var SearchTerm = SearchBar.value;
    console.log(SearchTerm);
    var FilteredDatabase = Database.filter(function (el) {
        return el.primaryTitle.toLowerCase().includes(SearchTerm.toLowerCase()); // filter the database by the search term
      });
    console.log(FilteredDatabase);
    Page = 0;
    UpdatePage(0 , FilteredDatabase); //update the page
}



var FilterBar = document.getElementById("FilterBar");

function ShowFilterBar(){
    console.log(FilterBar);
    FilterBar.hidden = !FilterBar.hidden;
}

// When the filter button is clicked call the filter function
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
    UpdatePage(0 , movieFilter); //update page
}

var ImportButton = document.getElementById("ImportButton");
ImportButton.addEventListener("change", Import);

// import the data from a file
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

// export the data to a file
function Export(){
    var textToSave = JSON.stringify(CurrentSavedFavorites); // Convert Json array to a text JSON format
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'FavData.json';
    hiddenElement.click();
    hiddenElement.remove();
}

function randomFilm(){
    var RandomFilm = Database[Math.floor(Math.random() * Database.length)];
    console.log(RandomFilm);
    SearchBar.value = RandomFilm.primaryTitle;
    Search();
}