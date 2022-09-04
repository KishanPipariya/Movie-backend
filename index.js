const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const movieSchema = mongoose.Schema({
  id: {
    type: Number,
  },
  title: {
    type: String,
  },
  director: {
    type: String,
  },
  actor: {
    type: [String],
  },
  year: {
    type: Number,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

app.use(express.json());

app.get("/movie/:id", async (req, res) => {
  const id = req.params.id;

  let movie = await Movie.findOne({ id: id });
  if (!movie) {
    res.status(404).send({ msg: "Movie doesn't exist" });
    return;
  }
  res.send(movie);
});

app.get("/movie", async (req, res) => {
  const director = req.query.director;

  let movie = await Movie.find({ director: director });
  if (!movie) {
    res.status(404).send({ msg: "Director doesn't exist" });
    return;
  }
  res.send(movie);
});

app.delete("/movie/:id", async (req, res) => {
  const id = req.params.id;

  let db_res = await Movie.deleteOne({ id: id });
  res.send({ msg: "Movie deleted", data: db_res });
});

app.put("/movie/:id", async (req, res) => {
  const id = req.params.id;

  let { title, director, actor, year } = req.body;

  let db_res = await Movie.updateOne(
    { id: id },
    {
      title: title,
      director: director,
      actor: actor,
      year: year,
    }
  );

  res.send({ msg: "Movie has been updated", data: db_res });
});

app.post("/movie", (req, res) => {
  let { id, title, director, actor, year } = req.body;

  try {
    let movie = Movie({
      id: id,
      title: title,
      director: director,
      actor: actor,
      year: year,
    });

    movie.save();
    res.send({
      msg: "movie added",
      data: movie,
    });
    return;
  } catch (err) {
    res.status(500).send({ err: err });
  }
});

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL, () => {
  app.listen(PORT, () => {
    console.log("Server is running ...");
  });
});
