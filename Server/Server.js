const fs = require('fs');
const http = require('http');
const fetch = require('node-fetch');

//Server Initial Response
const server = http.createServer(function(req, res) {
  const filename = req.url.split('/');
  try{
    console.log(req.url);
    if (filename[1] == "Images") {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/png');
      const img = fs.readFileSync(`./Images/${filename[2]}`);
      res.write(img);
    }
    else if (filename[1] == "fonts"){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'font/woff2');
      res.write(fs.readFileSync(`./fonts/${filename[2]}`));
    }
    else if (filename[1] == "MainScripts"){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/javascript');
      res.write(fs.readFileSync(`./MainScripts/${filename[2]}`));
    }
    else if (filename[1] == "StarterDatabase.json"){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/json');
      res.write(fs.readFileSync("./StarterDatabase.json"));
    }else{
      switch (req.url) {
        case "/Style.css":
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/css');
          const css = fs.readFileSync('./Style.css');
          res.write(css);
          break;
  
        default:
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          const html = fs.readFileSync('./index.html');
          res.write(html);
      }
    }
  }
  catch (err) {
    res.statusCode = 404;
    res.write('404 Not Found');
  }
  res.end();
})

const port = 3000;

server.listen(port, function(error) {
  if (error) {
    console.log('Something went wrong', error);
  } else {
    console.log('Server is listening on port ' + port);
  }
});

//Database



async function getData(filmID) {
  const FilmData = await fetch('http://www.omdbapi.com/?i=' + filmID +'&apikey=21bc72d6' );
  const FilmDataJson = await FilmData.json();
  return FilmDataJson;

}


let rawdata = fs.readFileSync('./StarterDatabase.json');
let Films = JSON.parse(rawdata);

const removeAdultFilms = (List) => List.filter(Films => Films.isAdult != 1);
const removeEpisodes = (List) => List.filter(Films => Films.titleType != "tvEpisode");
const removeVideoGames = (List) => List.filter(Films => Films.titleType != "videoGame");
const removeVideos = (List) => List.filter(Films => Films.titleType != "video");

function RemoveUnwantedFilms(){
  const StartNumber = Films.length;

  Films=removeAdultFilms(Films);
  Films=removeEpisodes(Films);
  Films=removeVideoGames(Films);
  Films=removeVideos(Films);
  fs.writeFileSync('./StarterDatabase.json', JSON.stringify(Films , null , "\t"));
  console.log("Films Removed - " + (StartNumber - Films.length));
}

async function UpdateFilmData() {
  RemoveUnwantedFilms();
  for (var i = 5400; i < 5400; i++) {
    if (Films[i].PosterImage == null){
      let CurrentReturnData = await getData(Films[i].tconst);
      Films[i].PosterImage = CurrentReturnData.Poster;
      Films[i].Director = CurrentReturnData.Director;
      Films[i].Actors = CurrentReturnData.Actors;
      Films[i].Plot = CurrentReturnData.Plot;
      Films[i].Ratings = CurrentReturnData.RaStings;
      Films[i].imdbRating = CurrentReturnData.imdbRating;
      Films[i].language = CurrentReturnData.language;
      console.log(Films[i])
      //
    }
  };
  fs.writeFileSync('./StarterDatabase.json', JSON.stringify(Films , null , "\t"));
  console.log("Done");
}

UpdateFilmData();




/*
var ModernFilms = Films.filter(function (n, i) {
    return n.startYear > 2000;
});



console.log(ModernFilms);
*/
