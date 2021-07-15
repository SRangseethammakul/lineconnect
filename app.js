const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const lineMessageRouter = require('./routes/lineMessage');
const lineMiddleRouter = require('./routes/lineMiddle.js');
const apisRouter = require('./routes/apisRouter.js');

//import middleware
const errorHandler = require('./middleware/errorHandler');
const passportJWT = require('./middleware/passportJWT');
const cors = require('cors');
const app = express();

//init passport
app.use(passport.initialize());

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
app.use('/apis/connect',[passportJWT.isLogin], apisRouter);


app.use(errorHandler);
module.exports = app;
