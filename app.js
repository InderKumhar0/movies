const express = require("express");
const authRoute = require("./routes/authRoutes");
const moviesRoute = require("./routes/moviesRoutes");
const actorRoute = require("./routes/actorRoutes");
const directorRoute = require("./routes/directorRoutes");
const globalErrorHandler = require('./controllers/errorController');

const { authenticateApiKeyAndToken } = require("./middleware/auth");
const AppError = require("./utils/appError");


const app = express();

app.use(express.json());

app.use("/api/v1", authRoute);

app.use(authenticateApiKeyAndToken);
app.use("/api/v1/movie", moviesRoute);
app.use("/api/v1/actor", actorRoute);
app.use("/api/v1/director", directorRoute);

app.all('*', (req, res, next) => {

    next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
