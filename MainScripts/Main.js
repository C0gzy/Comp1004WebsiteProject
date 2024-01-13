var Page = 0;
var DisplayPerPage = 60;
var CurrentDisplayedImages = [];
var Database;

window.onload = function() {
    fetch('/StarterDatabase.json').then(response => response.json()).then(data => {
        console.log(data);
        Database = data;

        UpdatePage();

    })

}



function UpdatePage(increment = 0) {
    Page += increment;

    if (Page < 0){ 
        Page = 0;
    }

    document.getElementById("PageNumber").innerHTML = "Page " + (Page + 1) + " of " + Math.ceil(Database.length / DisplayPerPage);
    for (var i=0; i < CurrentDisplayedImages.length; i++){
        CurrentDisplayedImages[i].remove();
    }

    for (var i=(Page * DisplayPerPage); i < (Page * DisplayPerPage) + DisplayPerPage; i++){
        var FilmImage = document.createElement("div")
        var PosterImage = "Images/No_picture_available.png"
        if ((Database[i].PosterImage != null ) && (Database[i].PosterImage != "N/A")){
            PosterImage = Database[i].PosterImage;
        }
        console.log(PosterImage);
        FilmImage.innerHTML = 
        `<button class="grid-item"> 
            <img class="Grid-Image" src=${PosterImage} > 
            <div hidden class="MovieDetails"> 
                <h1 class="MovieDetailsTitle">${Database[i].primaryTitle}</h1>
                <img class="MovieDetailsImage" src=${PosterImage} >  
                <p class="MovieDetailsPlot">Release Year: ${Database[i].startYear} \n \n Plot: \n ${Database[i].Plot}</p>
                <p class="Rating">      Rating: \n${Database[i].imdbRating}</p>
                <p class="Genres">Genres: \n${Database[i].genres}</p>
                <p class="DirectorAndActors">Director: ${Database[i].Director}\n Actors: ${Database[i].Actors}</p>
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