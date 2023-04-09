var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const sequelize = require('./db');
const User = require('./models/User')
const H2F_Q = require('./models/H2F/H2F_Q')
const H2F_A = require('./models/H2F/H2F_A')
const H2F_R = require('./models/H2F/H2F_R')

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');
var aboutRouter = require('./routes/about');
var h2fRouter = require('./routes/h2f');
var unitsummary = require('./routes/unitsummary');


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
app.use('/h2f', h2fRouter);
app.use('/unitsummary', unitsummary);

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

// question: "How long should you cool down after a workout?"}
// question: "All of the following can be results of doing a proper cool down after exercise EXCEPT:"

async function setup() {

  const user = await User.create({firstname: "John", lastname: "Doe", unit: "1st", email: "user", rank: "Sgt"})
  const unitleader = await User.create({firstname: "Jane", lastname: "Doe", unit: "1st", email: "unit", rank: "SSgt", password: '1234', isUnitLeader: true})
  const admin = await User.create({firstname: "Brian", lastname: "Harder", unit: "1st", email: "admin", rank: "Cpt", password: '1234', isAdmin: true})

  const h2f_q1 = await H2F_Q.create({qid: 1, question: "How long should you cool down after a workout?"})
  const h2f_a1 = await H2F_A.create({qid: 1, aid: 1, answer: "30 minutes", correct: false})
  const h2f_a2 = await H2F_A.create({qid: 1, aid: 2, answer: "75 minutes", correct: false})
  const h2f_a3 = await H2F_A.create({qid: 1, aid: 3, answer: "300 minutes", correct: false})
  const h2f_a4 = await H2F_A.create({qid: 1, aid: 4, answer: "150 minutes", correct: true})

  const h2f_q2 = await H2F_Q.create({qid: 2, question: "All of the following can be results of doing a proper cool down after exercise EXCEPT:"})
  const h2f_a5 = await H2F_A.create({qid: 2, aid: 5, answer: "Slowly reducing heart rate", correct: false})
  const h2f_a6 = await H2F_A.create({qid: 2, aid: 6, answer: "Preventing blood pooling in the extremities", correct: false})
  const h2f_a7 = await H2F_A.create({qid: 2, aid: 7, answer: "Increase the body's ability to burn fat", correct: true})
  const h2f_a8 = await H2F_A.create({qid: 2, aid: 8, answer: "Enhancing Flexibility and range of motion", correct: false})

  const h2f_q3 = await H2F_Q.create({qid: 3, question: "Body composition and Body Mass Index (BMI) are the same thing."})
  const h2f_a9 = await H2F_A.create({qid: 3, aid: 9, answer: "True", correct: false})
  const h2f_a10 = await H2F_A.create({qid: 3, aid: 10, answer: "False", correct: true})

  const h2f_q4 = await H2F_Q.create({qid: 4, question: "Static stretching should be done before a workout."})
  const h2f_a11 = await H2F_A.create({qid: 4, aid: 11, answer: "True", correct: false})
  const h2f_a12 = await H2F_A.create({qid: 4, aid: 12, answer: "False", correct: true})

  const user1 = await User.create({firstname: "Jack", lastname: "Doe", unit: "1st", email: "user1", rank: "Pvt"})
  const user2 = await User.create({firstname: "Jill", lastname: "Shawn", unit: "1st", email: "user2", rank: "Pvt"})
  const user3 = await User.create({firstname: "Joe", lastname: "Johnson", unit: "1st", email: "user3", rank: "Sgt"})

  const user1_res = await H2F_R.create({email: "user1", unit: "1st",results: "{1: 4, 2: 5, 3: 9, 4: 11}", score: 1})
  const user2_res = await H2F_R.create({email: "user2", unit: "1st",results: "{1: 1, 2: 8, 3: 10, 4: 12}", score: 2})
  const user3_res = await H2F_R.create({email: "user3", unit: "1st",results: "{1: 4, 2: 7, 3: 10, 4: 11}", score: 3})

  console.log("Data Entered")
}

sequelize.sync({force: true, alter: true}).then(()=>{
  console.log("Database synced")
  setup().then(()=>console.log("Setup completed"))
})

module.exports = app;
