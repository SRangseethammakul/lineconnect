var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const lineMessageRouter = require('./routes/lineMessage');
const lineMiddleRouter = require('./routes/lineMiddle.js');
const apisRouter = require('./routes/apisRouter.js');
const cors = require('cors');
var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/apis/linemessage', lineMessageRouter);
app.use('/apis/linemiddle', lineMiddleRouter);
app.use('/apis/connect', apisRouter);

module.exports = app;
