const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const db = require("./../db");

exports.createMovie = catchAsync(async (req, res) => {
  const { title, genre, release_year, actorIds, directorId } = req.body;

  if (!actorIds || !directorId)
    return next(new AppError('Please provide actor and director id', 400))

    await db.query("BEGIN");
    const [result] = await db.execute(
      "INSERT INTO movies (title, genre, release_year) VALUES (?, ?, ?)",
      [title, genre, release_year]
    );

    for (const actorId of actorIds) {
      await db.execute(
        "INSERT INTO movie_actors(movie_id, actor_id) VALUES (?, ?)",
        [result.insertId, actorId]
      );
    }
    await db.execute(
      "INSERT INTO movie_directors(movie_id, director_id) VALUES (?, ?)",
      [result.insertId, directorId]
    );
    await db.query("COMMIT");
    res
      .status(201)
      .json({ message: "Movie created", movieId: result.insertId });
});


exports.updateMovie = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { title, genre, release_year, actorIds, directorId } = req.body;

  if (!actorIds || !directorId)
    return next(new AppError('Please provide actor and director id', 400))


    await db.query("BEGIN");
    await db.execute(
      "UPDATE movies SET title = ?, genre = ?, release_year = ? WHERE id = ?",
      [title, genre, release_year, id]
    );
    if (actorIds) {
      for (const actorId of actorIds) {
        await db.execute(
          "UPDATE movie_actors SET actor_id = ? WHERE movie_id = ?",
          [actorId, id]
        );
      }
    }

    if (directorId) {
      await db.execute(
        "UPDATE movie_directors SET director_id = ? WHERE movie_id = ?",
        [directorId, id]
      );
    }

    await db.query("COMMIT");
    res.status(201).json({ message: "Movie updated successfully" });
});

exports.deleteMovie = catchAsync(async (req, res) => {
  const { id } = req.params;
    await db.query("BEGIN");
    await db.execute("DELETE FROM movie_actors WHERE movie_id = ?", [id]);
    await db.execute("DELETE FROM movie_directors WHERE movie_id = ?", [id]);
    await db.execute("DELETE FROM movies where id = ?", [id]);
    await db.query("COMMIT");
    res.status(201).json({ message: "Movie deleted successfully" });
});

exports.getAllMovies = catchAsync(async (req, res) => {
    const [movies] = await db.execute(`
            SELECT 
                movies.id, 
                movies.title, 
                movies.genre, 
                movies.release_year,
                GROUP_CONCAT(DISTINCT actors.name) AS actors, 
                GROUP_CONCAT(DISTINCT directors.name) AS directors
            FROM movies
            LEFT JOIN movie_actors ON movies.id = movie_actors.movie_id
            LEFT JOIN actors ON movie_actors.actor_id = actors.id
            LEFT JOIN movie_directors ON movies.id = movie_directors.movie_id
            LEFT JOIN directors ON movie_directors.director_id = directors.id
            GROUP BY movies.id, movies.title, movies.genre, movies.release_year
        `);
    res.json(movies);
});

exports.getMoviesBySpecificYear = catchAsync(async (req, res) => {
  const { year } = req.params;

    const [movies] = await db.execute(
      `
            SELECT 
                movies.id, 
                movies.title, 
                movies.genre, 
                movies.release_year,
                COUNT(movie_actors.actor_id) AS actor_count
            FROM movies
            LEFT JOIN movie_actors ON movies.id = movie_actors.movie_id
            WHERE movies.release_year = ?
            GROUP BY movies.id, movies.title, movies.genre, movies.release_year
        `,
      [year]
    );

    res.json(movies);
});

exports.getActorsByDirector = catchAsync(async (req, res) => {
  const { directorId } = req.params;

  if (!directorId) {
    return next(new AppError('Director ID parameter is required', 400))
  }

    const [actors] = await db.execute(
      `
            SELECT actors.id, actors.name, COUNT(movie_actors.movie_id) AS movie_count
            FROM actors
            JOIN movie_actors ON actors.id = movie_actors.actor_id
            JOIN movies ON movie_actors.movie_id = movies.id
            JOIN movie_directors ON movies.id = movie_directors.movie_id
            WHERE movie_directors.director_id = ?
            GROUP BY actors.id, actors.name
            HAVING COUNT(movie_actors.movie_id) > 1
        `,
      [directorId]
    );

    res.json(actors);
});

exports.getAverageActorsByGenre = catchAsync(async (req, res) => {
  const { genre } = req.params;

  if (!genre) {
    return next(new AppError('Genre parameter is required', 400))
    return res.status(400).json({ error: "Genre parameter is required" });
  }


    const [result] = await db.execute(
      `
            SELECT 
                AVG(actor_count) AS average_actors_per_movie
            FROM (
                SELECT 
                    movies.id, 
                    COUNT(movie_actors.actor_id) AS actor_count
                FROM movies
                LEFT JOIN movie_actors ON movies.id = movie_actors.movie_id
                WHERE movies.genre = ?
                GROUP BY movies.id
            ) AS actor_counts_per_movie
        `,
      [genre]
    );

    res.json(result[0]);
});
