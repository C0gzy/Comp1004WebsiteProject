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



function UpdatePage() {
    console.log("Updating Page" + CurrentDisplayedImages);
    for (var i=0; i < CurrentDisplayedImages.length; i++){
        CurrentDisplayedImages[i].remove();
    }

    for (var i=(Page * DisplayPerPage); i < (Page * DisplayPerPage) + DisplayPerPage; i++){
        console.log(Database[i].primaryTitle);
        var FilmImage = document.createElement("div")

        if ((Database[i].PosterImage == null ) || (Database[i].PosterImage == "N/A")){
            FilmImage.innerHTML = `<button class="grid-item"> <img class="Grid-Image" src=Images/No_picture_available.png > </button>`
        }else{
            FilmImage.innerHTML = `<button class="grid-item"> <img class="Grid-Image" src=${Database[i].PosterImage} > </button>`
        }

        document.getElementById("FilmGrid").appendChild(FilmImage);  
        CurrentDisplayedImages.push(FilmImage);   
    }
    Page++;
}