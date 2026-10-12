const pool = require("../config/db");


// GET ALL MOVIES
const getMovies = async (req, res) => {

    try {

        const [movies] = await pool.execute(
            `SELECT *
             FROM movies
             ORDER BY created_at DESC`
        );

        res.json(movies);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch movies"
        });
    }
};


// GET SINGLE MOVIE
const getMovie = async (req, res) => {

    try {

        const [movies] = await pool.execute(
            `SELECT *
             FROM movies
             WHERE id = ?`,
            [req.params.id]
        );

        if (movies.length === 0) {

            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.json(movies[0]);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch movie"
        });
    }
};


// CREATE MOVIE
const createMovie = async (req, res) => {

    try {

        const {
            title,
            description,
            genre,
            language,
            duration,
            release_date,
            poster_url,
            trailer_url,
            status
        } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO movies
            (
                title,
                description,
                genre,
                language,
                duration,
                release_date,
                poster_url,
                trailer_url,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                description,
                genre,
                language,
                duration,
                release_date,
                poster_url,
                trailer_url,
                status || "upcoming"
            ]
        );

        res.status(201).json({
            message: "Movie created",
            movieId: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create movie"
        });
    }
};


// UPDATE MOVIE
const updateMovie = async (req, res) => {

    try {

        const {
            title,
            description,
            genre,
            language,
            duration,
            release_date,
            poster_url,
            trailer_url,
            status
        } = req.body;

        await pool.execute(
            `UPDATE movies
             SET
                title = ?,
                description = ?,
                genre = ?,
                language = ?,
                duration = ?,
                release_date = ?,
                poster_url = ?,
                trailer_url = ?,
                status = ?
             WHERE id = ?`,
            [
                title,
                description,
                genre,
                language,
                duration,
                release_date,
                poster_url,
                trailer_url,
                status,
                req.params.id
            ]
        );

        res.json({
            message: "Movie updated"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to update movie"
        });
    }
};


// DELETE MOVIE
const deleteMovie = async (req, res) => {

    try {

        await pool.execute(
            "DELETE FROM movies WHERE id = ?",
            [req.params.id]
        );

        res.json({
            message: "Movie deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete movie"
        });
    }
};


module.exports = {
    getMovies,
    getMovie,
    createMovie,
    updateMovie,
    deleteMovie
};