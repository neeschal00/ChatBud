
const createError = require('http-errors');
const express = require('express');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const chatRouter = require('./routes/chat');
require("./config/database").connect();



// Adding socket io with http server


const app = express();
const cors = require('cors');
const helmet = require('helmet');

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Usage of Swagger in api",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/chat",
      },
    ],
  },
  apis: ["./routes/chat.js","./routes/index.js","./routes/users.js","./routes/notification.js"],
};
const specs = swaggerJsdoc(options);

app.use(cors({origin:'*'}));
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //you cannot send nested query string with this
app.use(cookieParser());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs,{ explorer: true })
);
// app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('combined'));
app.use('/Pictures', express.static('Pictures'));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
console.log("akkans");
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method ==="OPTIONS"){
    res.header("Access-Control-Allow-Methods","PUT, PATCH, POST, DELETE, GET")
    return res.status(200).json({});
  }


  // render the error page
  res.status(err.status || 500);
  res.json({"message":err});
  // res.render('error');
  next();
});

module.exports = app;
