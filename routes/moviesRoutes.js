const express = require("express");
const { getMoviesBySpecificYear, getActorsByDirector, getAverageActorsByGenre, createMovie, updateMovie, deleteMovie, getAllMovies } = require("../controllers/movieController");
const { authenticateApiKeyAndToken, checkAdminRole } = require("../middleware/auth");

const router = express.Router();


router.use(authenticateApiKeyAndToken);
router.get("/", getAllMovies);
router.get("/director/:directorId", getActorsByDirector);
router.get("/:year", getMoviesBySpecificYear);
router.get("/average-actors/:genre", getAverageActorsByGenre);

router.use(checkAdminRole);
router.post('/', createMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);



module.exports = router;
