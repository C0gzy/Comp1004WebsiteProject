var Page = 0;
var DisplayPerPage = 60;

window.onload = function() {
    fetch('/StarterDatabase.json').then(response => response.json()).then(data => {
        console.log(data);
        UpdatePage();

    })

}

function UpdatePage() {

    for (var i=0; i < (Page * 10) + DisplayPerPage; i++){
        console.log(data[i].primaryTitle);
        var FilmImage = document.createElement("div")

        if ((data[i].PosterImage == null ) || (data[i].PosterImage == "N/A")){
            FilmImage.innerHTML = `<button class="grid-item"> <img  src=Images/No_picture_available.png > </button>`
        }else{
            FilmImage.innerHTML = `<button class="grid-item"> <img  src=${data[i].PosterImage} > </button>`
        }

        document.getElementById("FilmGrid").appendChild(FilmImage);     
    }
}