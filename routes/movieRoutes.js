const express = require("express");

const {
    getMovies,
    getMovie,
    createMovie,
    updateMovie,
    deleteMovie
} = require("../controllers/movieController");

const {
    authenticate,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getMovies);

router.get("/:id", getMovie);

router.post(
    "/",
    authenticate,
    adminOnly,
    createMovie
);

router.put(
    "/:id",
    authenticate,
    adminOnly,
    updateMovie
);

router.delete(
    "/:id",
    authenticate,
    adminOnly,
    deleteMovie
);

module.exports = router;