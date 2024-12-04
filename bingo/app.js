const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {rateLimit} = require("express-rate-limit")
const cors = require('cors');


const indexRouter = require('./routes/index');
const eventRouter = require("./routes/event")
const fieldsNamesRouter = require("./routes/fieldsNames")
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 5 minutes
  limit: 175, // Limit each IP to 50 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
})

app.use(cors());
app.use(limiter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/favicon.ico', express.static('favicon.ico'));

app.use('/', indexRouter);
app.use('/event', eventRouter)
app.use('/config', fieldsNamesRouter)
app.get("*", (req, res)=>{
  res.status(404).render("error", {message: "nope, źle szukasz <3 \n", error: {status: 404}})
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
