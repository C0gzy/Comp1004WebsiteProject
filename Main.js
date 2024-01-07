



import Films from './StarterDatabase.json' assert { type: "json" };


var MaxDisplayPerPage = 10;

//100

function getData(filmID) {
  return fetch('http://www.omdbapi.com/?i=' + filmID +'&apikey=21bc72d6' , {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())

}

getData("tt10127678").then(data => console.log(data));


/*

for (var i = 0; i < Films.length; i++) {
    Films[i].
};
*/


/*
var ModernFilms = Films.filter(function (n, i) {
    return n.startYear > 2000;
});



console.log(ModernFilms);
*/