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
/* ADD YOUR ADDITIONAL MODELS HERE */
// const CPA_A = require('./models/CPA/CPA_A')//leave in for when I clean up code if you remvoe its all good though
// const CPA_Q = require('./models/CPA/CPA_Q')
const CPA_R = require('./models/CPA/CPA_R')
const {CPA_A, CPA_Q} = require('./models/CPA/association')

const FMS_Q = require('./models/FMS/FMS_Q')
const FMS_A = require('./models/FMS/FMS_A')

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');
var aboutRouter = require('./routes/about');
var h2fRouter = require('./routes/h2f');
var unitsummaryRouter = require('./routes/unitsummary');
var fmsRouter = require('./routes/fms');
var cpaRouter = require('./routes/cpa');

const { json } = require('sequelize');



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
app.use('/unitsummary', unitsummaryRouter);
app.use('/fms', fmsRouter);
app.use('/cpa', cpaRouter);

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

  const user = await User.create({firstname: "John", lastname: "Doe", unit: "1st", email: "john.doe@army.mil", rank: "Sgt"})
  const unitleader = await User.create({firstname: "Jane", lastname: "Doe", unit: "1st", email: "jane.doe@army.mil", rank: "SSgt", password: '1234', isUnitLeader: true})
  const admin = await User.create({firstname: "Brian", lastname: "Harder", unit: "1st", email: "brian.harder@army.mil", rank: "Cpt", password: '1234', isAdmin: true})

  const h2f_q1 = await H2F_Q.create({qid: 1, question: "How long should you cool down after a workout?", category: "Physical"})
  const h2f_a1 = await H2F_A.create({qid: 1, answer: "30 minutes", correct: false})
  const h2f_a2 = await H2F_A.create({qid: 1, answer: "75 minutes", correct: false})
  const h2f_a3 = await H2F_A.create({qid: 1, answer: "300 minutes", correct: false})
  const h2f_a4 = await H2F_A.create({qid: 1, answer: "150 minutes", correct: true})

  const h2f_q2 = await H2F_Q.create({qid: 2, question: "All of the following can be results of doing a proper cool down after exercise EXCEPT:", category: "Physical"})
  const h2f_a5 = await H2F_A.create({qid: 2, answer: "Slowly reducing heart rate", correct: false})
  const h2f_a6 = await H2F_A.create({qid: 2, answer: "Preventing blood pooling in the extremities", correct: false})
  const h2f_a7 = await H2F_A.create({qid: 2, answer: "Increase the body's ability to burn fat", correct: true})
  const h2f_a8 = await H2F_A.create({qid: 2, answer: "Enhancing Flexibility and range of motion", correct: false})

  const h2f_q3 = await H2F_Q.create({qid: 3, question: "Which of the following is not a food group:", category: "Nutrition"})
  const h2f_a9 = await H2F_A.create({qid: 3,  answer: "Fruits", correct: false})
  const h2f_a10 = await H2F_A.create({qid: 3,  answer: "Rice", correct: true})
  const h2f_a11 = await H2F_A.create({qid: 3,  answer: "Grains", correct: false})
  const h2f_a12 = await H2F_A.create({qid: 3,  answer: "Protein", correct: false})

  const h2f_q4 = await H2F_Q.create({qid: 4, question: "All of the following are examples of whole grains except:", category: "Nutrition"})
  const h2f_a13 = await H2F_A.create({qid: 4, answer: "Brown Rice", correct: false})
  const h2f_a14 = await H2F_A.create({qid: 4, answer: "White Bread", correct: true})
  const h2f_a15 = await H2F_A.create({qid: 4, answer: "Popcorn", correct: false})
  const h2f_a16 = await H2F_A.create({qid: 4, answer: "Oatmeal", correct: false})

  const h2f_q5 = await H2F_Q.create({qid: 5, question: "The ability to sense other people's emotions is known as:", category: "Mental"})
  const h2f_a17 = await H2F_A.create({qid: 5, answer: "Empathy", correct: true})
  const h2f_a18 = await H2F_A.create({qid: 5, answer: "Kinesis", correct: false})
  const h2f_a19 = await H2F_A.create({qid: 5, answer: "Mind Reading", correct: false})
  const h2f_a20 = await H2F_A.create({qid: 5, answer: "Sympathy", correct: false})

  const h2f_q6 = await H2F_Q.create({qid: 6, question: "The ability to sort through irrelevant information and thoughts to concentrate and focus on a specific task is known as:", category: "Mental"})
  const h2f_a21 = await H2F_A.create({qid: 6, answer: "Attention", correct: false})
  const h2f_a22 = await H2F_A.create({qid: 6, answer: "Centralizing", correct: false})
  const h2f_a23 = await H2F_A.create({qid: 6, answer: "Processing", correct: true})
  const h2f_a24 = await H2F_A.create({qid: 6, answer: "Details", correct: false})

  const h2f_q7 = await H2F_Q.create({qid: 7, question: "The idea of learning how to be fully present and engaged in moment and aware of your thoughts and feelings without distraction or judgment is:", category: "Spiritual"})
  const h2f_a26 = await H2F_A.create({qid: 7, answer: "Inner Peace", correct: false})
  const h2f_a27 = await H2F_A.create({qid: 7, answer: "Serenity", correct: false})
  const h2f_a28 = await H2F_A.create({qid: 7, answer: "Empathy", correct: false})
  const h2f_a25 = await H2F_A.create({qid: 7, answer: "Mindfulness", correct: true})

  const h2f_q8 = await H2F_Q.create({qid: 8, question: "The process of two people or groups in a conflict agreeing to make amends or come to a truce is known as:", category: "Spiritual"})
  const h2f_a30 = await H2F_A.create({qid: 8, answer: "Compatibility", correct: false})
  const h2f_a31 = await H2F_A.create({qid: 8, answer: "Engagement", correct: false})
  const h2f_a29 = await H2F_A.create({qid: 8, answer: "Reconciliation", correct: true})
  const h2f_a32 = await H2F_A.create({qid: 8, answer: "Empathy", correct: false})

  const h2f_q9 = await H2F_Q.create({qid: 9, question: "Adults need at least how many hours of sleep per night?", category: "Sleep"})
  const h2f_a33 = await H2F_A.create({qid: 9, answer: "4-5 Hours", correct: false})
  const h2f_a34 = await H2F_A.create({qid: 9, answer: "6-7 Hours", correct: false})
  const h2f_a35 = await H2F_A.create({qid: 9, answer: "7-8 Hours", correct: true})
  const h2f_a36 = await H2F_A.create({qid: 9, answer: "5-6 Hours", correct: false})

  const h2f_q10 = await H2F_Q.create({qid: 10, question: "Being awake for more than 20 hours results in an impairment equal to a blood alcohol level of 0.08%.", category: "Sleep"})
  const h2f_a37 = await H2F_A.create({qid: 10, answer: "True", correct: true})
  const h2f_a38 = await H2F_A.create({qid: 10, answer: "False", correct: false})



  const user1 = await User.create({firstname: "Tom", lastname: "Hall", unit: "1st", email: "tom.hall@army.mil", rank: "Pvt"})
  const user2 = await User.create({firstname: "Jill", lastname: "Shawn", unit: "1st", email: "jill.shawn@army.mil", rank: "Pvt"})
  const user3 = await User.create({firstname: "Joe", lastname: "Johnson", unit: "1st", email: "joe.johnson@army.mil", rank: "Sgt"})

  let res1 = {1: 4, 2: 7, 3: 10, 4: 14, 5: 17, 6: 23, 7: 28, 8: 31, 9: 35, 10: 37} // full 10
  let res2 = {1: 4, 2: 8, 3: 10, 4: 15, 5: 17, 6: 23, 7: 25, 8: 31, 9: 34, 10: 38} // -5
  let res3 = {1: 3, 2: 7, 3: 9, 4: 14, 5: 17, 6: 24, 7: 28, 8: 31, 9: 35, 10: 37} // -3

  const user1_res = await H2F_R.create({email: "tom.hall@army.mil", unit: "1st",results: JSON.stringify(res1), score: 10})
  const user2_res = await H2F_R.create({email: "jill.shawn@army.mil", unit: "1st",results: JSON.stringify(res2), score: 5})
  const user3_res = await H2F_R.create({email: "joe.johnson@army.mil", unit: "1st",results: JSON.stringify(res3), score: 7})
  const user4 = await User.create({firstname: "Adam", lastname: "Smith", unit: "1st", email: "adam.smith@army.mil", rank: "Cpl"})

  /* ADD ADDITIONAL NEEDED DATA HERE BASED ON YOUR MODELS */

  /*CPA user USING THIS USER FOR MY TEST*/
  const cpaUser = await User.create({firstname: "James", lastname: "Bond", unit: "1st", email: "james.bond@army.mil", rank: "Sgt"})

  

  console.log("Data Entered")
}

sequelize.sync({force: true, alter: true}).then(()=>{
  console.log("Database synced")
  setup().then(()=>console.log("Setup completed"))
})

module.exports = app;
