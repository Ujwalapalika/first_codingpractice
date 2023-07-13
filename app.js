const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
const dbpath = path.join(__dirname, "moviesData.db");
let db = null;
const intialDBserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
intialDBserver();
const directornames = (eachdirector) => {
  return {
    directorId: eachdirector.director_id,
    directorName: eachdirector.director_name,
  };
};
const conversionmovie = (movieName) => {
  return {
    movieName: movieName,
  };
};
const movienamefn = (movienames) => {
  return {
    movieId: movienames.movie_id,
    directorId: movienames.director_id,
    movieName: movienames.movie_name,
    leadActor: movienames.lead_actor,
  };
};
app.get("/movies/", async (request, response) => {
  const getmovienames = `select movie_name as movieName from movie;`;
  const dbresponse = await db.all(getmovienames);
  response.send(dbresponse.map((movienames) => conversionmovie(movienames)));
});
app.post("/movies/", async (request, response) => {
  const movieadd = request.body;
  const { directorId, movieName, leadActor } = movieadd;
  const addmovie = `insert into movie( director_id as directorid,
          movie_name as movieName,
          lead_actor as  leadActor ) values(${directorId},${moviename},${leadactor});`;
  dbresponse = await db.run(addmovie);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movie_id } = request.params;
  const moviequery = `select * from movie where movieid=${movie_id}`;
  const dbresponse = await db.get(moviequery);
  response.send(movienamefn(dbresponse));
});
app.put("/movies/:movieId/", async (request, response) => {
  const { movie_id } = request.params;
  const movieupdate = request.body;
  const { directorId, movieName, leadActor } = movieupdate;
  const movieupdatequery = `update movie set director_id=${directorId},movie_name=${movieName},lead_actor=${leadActor} where movieid=${movie_id};`;
  const dbresponse = await db.run(movieupdatequery);
  response.send("Movie Details Updated");
});
app.delete("/movies/:movieId/", async (request, response) => {
  const { movie_id } = request.params;
  const deletequery = `delete * from movie where movieid=${movie_id};`;
  const dbresponse = await db.run(deletequery);
  response.send("Movie removed");
});
app.get("/directors/", async (request, response) => {
  const director = `select * from director;`;
  const dbresponse = await db.all(director);
  response.send(dbresponse.map((eachdirector) => directornames(eachdirector)));
});
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { director_id } = request.params;
  const directorlist = `select movie_name as moviename from movie where directorid=${director_id};`;
  dbresponse = await db.all(directorlist);
  response.send(dbresponse.map((eachdir) => movienamefn(eachdir)));
});

module.exports = app;
