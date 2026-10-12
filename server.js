require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes =
    require("./routes/authRoutes");

const movieRoutes =
    require("./routes/movieRoutes");


const app = express();


/* Middleware */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


/* Routes */

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/movies",
    movieRoutes
);


/* Health check */

app.get("/", (req, res) => {

    res.json({
        message: "Multiplex Management System API is running"
    });
});


/* 404 */

app.use((req, res) => {

    res.status(404).json({
        message: "API route not found"
    });
});


/* Error handler */

app.use((error, req, res, next) => {

    console.error(error);

    res.status(500).json({
        message: "Internal server error"
    });
});


const PORT =
    process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );
});