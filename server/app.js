const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose')
const userRouter = require("./routes/userRoutes");
const pollRouter = require("./routes/pollRoutes");
const friendRouter = require("./routes/friendRoutes");
const { json, urlencoded } = express;

var app = express();
app.use(cors());
app.use(logger("dev"));
app.use(urlencoded({ extended: true ,limit:'50mb'}));
app.use(json({limit:'50mb'}));
app.use(multer().array('file',2))
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));
mongoose.set('useFindAndModify',false);

app.use("/friend",friendRouter);
app.use("/user",userRouter);
app.use("/poll",pollRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
