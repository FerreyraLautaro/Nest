const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const pdf = require('express-pdf');
const indexRouter = require('./routes/index');
const path = require("path")

const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet()); // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(pdf);
app.use('/', indexRouter);

// catch 404 and forward to error handler

app.use('/pdf', function(req, res){
  res.pdf(path.resolve('./label.pdf'));
})
app.use((req, res, next) => {
  next(createError.NotFound());
});

// pass any unhandled errors to the error handler
app.use(errorHandler);

module.exports = app;
