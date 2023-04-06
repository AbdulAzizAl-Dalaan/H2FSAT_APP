var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const sequelize = require('./db');
const User = require('./models/User')

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');
var aboutRouter = require('./routes/about');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/about', aboutRouter);

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

async function setup() {
  const user = await User.create({firstname: "John", lastname: "Doe", unit: "1st", email: "user", rank: "Sgt"})
  const unitleader = await User.create({firstname: "Jane", lastname: "Doe", unit: "1st", email: "unit", rank: "SSgt", password: '1234', isUnitLeader: true})
  const admin = await User.create({firstname: "Brian", lastname: "Harder", unit: "1st", email: "admin", rank: "Cpt", password: '1234', isAdmin: true})
  console.log("User created")
}

sequelize.sync({force: true}).then(()=>{
  console.log("Database synced")
  setup().then(()=>console.log("Setup completed"))
})

module.exports = app;
