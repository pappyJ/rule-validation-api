// start of third party modules
const express = require('express');

const morgan = require('morgan');

const cors = require('cors');

const globalErrorHandler = require('./errors/errorController');

const corsOptions = require('./config');

const AppError = require('./errors/appError');

const router = require('./routes/router');

const app = express();

//enabling cors

const corsConfig = cors(corsOptions);

//enabling cross origing resource sharing on all routes

app.use('*', corsConfig);

//enabling cross oduring pre flight phase

app.options('*', corsConfig);

//setting the body parsers

app.use(express.json({ limit: '10kb' }));

//using the morgan logger

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * @param { userRoutes } - All the routes concerning user
 */

app.use('/', router);

//handling all routes ==> 404 Pages

app.all('*', (req, res, next) => {
  const err = new AppError(`Can't Find ${req.originalUrl} On This Server`, 404);

  err.statusCode = 404;

  err.status = 'Failed';

  next(err);
});

app.use(globalErrorHandler);

//exporting the app module to Server

module.exports = app;
