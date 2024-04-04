var Page = 0;
var DisplayPerPage = 100;
var CurrentDisplayedImages = [];
var Database;

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
        }

        var FilmImage = document.createElement("div")
        var PosterImage = "Images/No_picture_available.png"
        if ((WhichSet[i].PosterImage != null ) && (WhichSet[i].PosterImage != "N/A")){
            PosterImage = WhichSet[i].PosterImage;
        }
        FilmImage.innerHTML = 
        `<button class="grid-item"> 
            <img class="Grid-Image" src=${PosterImage} > 
            <div hidden class="MovieDetails"> 
                <h1 class="MovieDetailsTitle">${WhichSet[i].primaryTitle}</h1>
                <img class="MovieDetailsImage" src=${PosterImage} >  
                <p class="MovieDetailsPlot">Release Year: ${WhichSet[i].startYear} \n \n Plot: \n ${WhichSet[i].Plot}</p>
                <p class="Rating">      Rating: \n${WhichSet[i].imdbRating}</p>
                <p class="Genres">Genres: \n${WhichSet[i].genres}</p>
                <p class="DirectorAndActors">Director: ${WhichSet[i].Director}\n Actors: ${WhichSet[i].Actors}</p>
            </div> 
        </button>`

        FilmImage.onclick = moviepostclick;


        document.getElementById("FilmGrid").appendChild(FilmImage);  

        CurrentDisplayedImages.push(FilmImage);   
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