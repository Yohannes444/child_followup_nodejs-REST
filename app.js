var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session =require('express-session')
var FileStore= require('session-file-store')(session)
var passport=require('passport')
var authenticate=require('./authenticate')
var config=require('./config')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var classRoomRouter = require('./routes/classRoomRouter')
var cashierRouter = require ('./routes/cashierRouter')
var teacherRouter = require ('./routes/teacherRouter')
var materialRouter = require ('./routes/materilaRouter')
var assignmentRouter = require('./routes/assignmentRouter')
var GradeRouter = require ('./routes/gradeRouter')
var childRouter = require ('./routes/studentRouter')
var monthlyFeeRouter = require('./routes/monthlyFeeRouter')
var ChatRoute =require('./routes/ChatRoute')
var MessageRoute=require('./routes/MessageRoute')
const cors=require('cors')
const mongoose = require('mongoose');
const studentRouter = require ('./routes/studentWightListRouter');
const attendanceRouter = require('./routes/attendanceRouter');

const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log("Connected correctly to server");
},(err)=>{console.log(err)}
)
var app = express();
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('yohannes-is-the-best'));


app.use(passport.initialize())

app.use('/', indexRouter);
//<<<<<<< Updated upstream
app.use('/users', usersRouter);

//=======
app.use('/git ', usersRouter);
//>>>>>>> Stashed changes
app.use(express.static(path.join(__dirname, 'public')));

//routes that can access the public folder
app.use('/classroom',classRoomRouter)
app.use('/cashier',cashierRouter)
app.use('/teacher',teacherRouter)
app.use('/wightlist',studentRouter)
app.use('/classMatrial',materialRouter)
app.use('/attendance',attendanceRouter)
app.use('/Assignment',assignmentRouter)
app.use('/grade',GradeRouter)
app.use('/child',childRouter)
app.use('/monthlyFee',monthlyFeeRouter)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)
// catch 404 and forward to error handler

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
