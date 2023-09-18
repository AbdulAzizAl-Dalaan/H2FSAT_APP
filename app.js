var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const sequelize = require('./db');
const User = require('./models/User')

/*
const H2F_Q = require('./models/H2F/H2F_Q')
const H2F_A = require('./models/H2F/H2F_A')
const H2F_R = require('./models/H2F/H2F_R')

const { CPA_A, CPA_Q } = require('./models/CPA/association')
const CPA_R = require('./models/CPA/CPA_R')

const FMS_Q = require('./models/FMS/FMS_Q')
const FMS_A = require('./models/FMS/FMS_A')
const FMS_R = require('./models/FMS/FMS_R')
*/

const Survey_Info = require('./models/Survey/Survey_Info')
const Survey_Q = require('./models/Survey/Survey_Q')
const Survey_A = require('./models/Survey/Survey_A')
const Survey_R = require('./models/Survey/Survey_R');

Survey_Info.hasMany(Survey_Q, { foreignKey: "survey_id" })
Survey_Q.belongsTo(Survey_Info)
Survey_Q.hasMany(Survey_A, { foreignKey: "question_id" })
Survey_Q.hasMany(Survey_A, { foreignKey: "survey_id" })
Survey_A.belongsTo(Survey_Q)

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');
var aboutRouter = require('./routes/about');
var h2fRouter = require('./routes/h2f');
var unitsummaryRouter = require('./routes/unitsummary');
var fmsRouter = require('./routes/fms');
var cpaRouter = require('./routes/cpa');

const { json } = require('sequelize');
// const setup = require('./setup')

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

// question: "How long should you cool down after a workout?"}
// question: "All of the following can be results of doing a proper cool down after exercise EXCEPT:"

async function setup() {
  const user = await User.create({ firstname: "John", lastname: "Doe", unit: "1st", email: "user", rank: "Sgt" })
  const unitleader = await User.create({ firstname: "Jane", lastname: "Doe", unit: "1st", email: "jane.doe@army.mil", rank: "SSgt", password: '1234', isUnitLeader: true })
  const admin = await User.create({ firstname: "Brian", lastname: "Harder", unit: "1st", email: "brian.harder@army.mil", rank: "Cpt", password: '1234', isAdmin: true })

  const survey_one       = await Survey_Info.create({survey_id: 5, author: "brian.harder@army.mil", title: "Survey One", description: "This is a test survey"})
  const survey_one_q2    = await Survey_Q.create({survey_id: 5, question_id: 1, prompt: "What is the capital of Washington State?", type: "one"})
  const survey_one_q2_a1 = await Survey_A.create({survey_id: 5, question_id: 1, answer_id: 1, text: "Seattle"})
  const survey_one_q2_a2 = await Survey_A.create({survey_id: 5, question_id: 1, answer_id: 2, text: "Pullman"})
  const survey_one_q2_a3 = await Survey_A.create({survey_id: 5, question_id: 1, answer_id: 3, text: "Olympia"})
  const survey_one_q2_a4 = await Survey_A.create({survey_id: 5, question_id: 1, answer_id: 4, text: "Vancouver"})
  const survey_one_q3    = await Survey_Q.create({survey_id: 5, question_id: 2, prompt: "Enter you name please?", type: "text"})
  const survey_one_q3_a1 = await Survey_A.create({survey_id: 5, question_id: 2, answer_id: 1, text: "Name"})
  const survey_one_q4    = await Survey_Q.create({survey_id: 5, question_id: 3, prompt: "What is your favorite number from 5-10?", type: "range", top_range: 10, bottom_range: 5})
  const survey_one_q4_a1 = await Survey_A.create({survey_id: 5, question_id: 3, answer_id: 1, text: "number"})
  const survey_one_q5    = await Survey_Q.create({survey_id: 5, question_id: 4, prompt: "Select all the classes that you have taken:", type: "all"})
  const survey_one_q5_a1 = await Survey_A.create({survey_id: 5, question_id: 4, answer_id: 1, text: "CPT_S 302"})
  const survey_one_q5_a2 = await Survey_A.create({survey_id: 5, question_id: 4, answer_id: 2, text: "CPT_S 350"})
  const survey_one_q5_a3 = await Survey_A.create({survey_id: 5, question_id: 4, answer_id: 3, text: "CPT_S 360"})
  const survey_one_q5_a4 = await Survey_A.create({survey_id: 5, question_id: 4, answer_id: 4, text: "CPT_S 421"})
  const survey_one_q6    = await Survey_Q.create({survey_id: 5, question_id: 5, prompt: "Can you see the following image",img: "FMS/DeepSquat.png", type: "one"})
  const survey_one_q6_a1 = await Survey_A.create({survey_id: 5, question_id: 5, answer_id: 1, text: "Yes"})
  const survey_one_q6_a2 = await Survey_A.create({survey_id: 5, question_id: 5, answer_id: 2, text: "No"})

  const h2f_info = await Survey_Info.create({survey_id: 1, author: "brian.harder@army.mil", title: "Holistic Health and Fitness (H2F) Knowledge Check", description: "H2F is designed to optimize Soldier personal readiness,\
  reduce injury rates, improve rehabilitation after injury, and increase the overall effectiveness of the Total Army. These assessment tools are designed to help you identify your strengths\
   and weaknesses in the areas of Holistic Health and Fitness and must be completed by all members of the Army National Guard along with the PHA.", show_question_numbers: true})

  const h2f_q1    = await Survey_Q.create({survey_id: 1, question_id: 1, prompt: "How long should you cool down after a workout?", type: "one"})
  const h2f_q1_a1 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 1, text: "30 minutes"})
  const h2f_q1_a2 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 2, text: "75 minutes"})
  const h2f_q1_a3 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 3, text: "300 minutes"})
  const h2f_q1_a4 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 4, text: "150 minutes"}) // correct

  const h2f_q2    = await Survey_Q.create({survey_id: 1, question_id: 2, prompt: "All of the following can be results of doing a proper cool down after exercise EXCEPT:", type: "one"})
  const h2f_q2_a1 = await Survey_A.create({survey_id: 1, question_id: 2, answer_id: 1, text: "Slowly reducing heart rate"})
  const h2f_q2_a2 = await Survey_A.create({survey_id: 1, question_id: 2, answer_id: 2, text: "Preventing blood pooling in the extremities"})
  const h2f_q2_a3 = await Survey_A.create({survey_id: 1, question_id: 2, answer_id: 3, text: "Increase the body's ability to burn fat"}) // correct
  const h2f_q2_a4 = await Survey_A.create({survey_id: 1, question_id: 2, answer_id: 4, text: "Enhancing Flexibility and range of motion"})

  const h2f_q3    = await Survey_Q.create({survey_id: 1, question_id: 3, prompt: "Which of the following is not a food group:", type: "one"})
  const h2f_q3_a1 = await Survey_A.create({survey_id: 1, question_id: 3, answer_id: 1, text: "Fruits"})
  const h2f_q3_a2 = await Survey_A.create({survey_id: 1, question_id: 3, answer_id: 2, text: "Rice"}) // correct
  const h2f_q3_a3 = await Survey_A.create({survey_id: 1, question_id: 3, answer_id: 3, text: "Grains"})
  const h2f_q3_a4 = await Survey_A.create({survey_id: 1, question_id: 3, answer_id: 4, text: "Protein"})

  const h2f_q4    = await Survey_Q.create({survey_id: 1, question_id: 4, prompt: "All of the following are examples of whole grains except:", type: "one"})
  const h2f_q4_a1 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 1, text: "Brown Rice"})
  const h2f_q4_a2 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 2, text: "White Bread"}) // correct
  const h2f_q4_a3 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 3, text: "Popcorn"})
  const h2f_q4_a4 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 4, text: "Oatmeal"})

  const h2f_q5    = await Survey_Q.create({survey_id: 1, question_id: 5, prompt: "The ability to sense other people's emotions is known as:", type: "one"})
  const h2f_q5_a1 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 1, text: "Empathy"}) // correct
  const h2f_q5_a2 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 2, text: "Kinesis"})
  const h2f_q5_a3 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 3, text: "Mind Reading"})
  const h2f_q5_a4 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 4, text: "Sympathy"})

  const h2f_q6    = await Survey_Q.create({survey_id: 1, question_id: 6, prompt: "The ability to sort through irrelevant information and thoughts to concentrate and focus on a specific task is known as:", type: "one"})
  const h2f_q6_a1 = await Survey_A.create({survey_id: 1, question_id: 6, answer_id: 1, text: "Attention"})
  const h2f_q6_a2 = await Survey_A.create({survey_id: 1, question_id: 6, answer_id: 2, text: "Centralizing"})
  const h2f_q6_a3 = await Survey_A.create({survey_id: 1, question_id: 6, answer_id: 3, text: "Processing"}) // correct
  const h2f_q6_a4 = await Survey_A.create({survey_id: 1, question_id: 6, answer_id: 4, text: "Details"})

  const h2f_q7    = await Survey_Q.create({survey_id: 1, question_id: 7, prompt: "The idea of learning how to be fully present and engaged in moment and aware of your thoughts and feelings without distraction or judgment is:", type: "one"})
  const h2f_q7_a1 = await Survey_A.create({survey_id: 1, question_id: 7, answer_id: 1, text: "Inner Peace"})
  const h2f_q7_a2 = await Survey_A.create({survey_id: 1, question_id: 7, answer_id: 2, text: "Serenity"})
  const h2f_q7_a3 = await Survey_A.create({survey_id: 1, question_id: 7, answer_id: 3, text: "Empathy"})
  const h2f_q7_a4 = await Survey_A.create({survey_id: 1, question_id: 7, answer_id: 4, text: "Mindfulness"}) // correct

  const h2f_q8    = await Survey_Q.create({survey_id: 1, question_id: 8, prompt: "The process of two people or groups in a conflict agreeing to make amends or come to a truce is known as:", type: "one"})
  const h2f_q8_a1 = await Survey_A.create({survey_id: 1, question_id: 8, answer_id: 1, text: "Compatibility"})
  const h2f_q8_a2 = await Survey_A.create({survey_id: 1, question_id: 8, answer_id: 2, text: "Engagement"})
  const h2f_q8_a3 = await Survey_A.create({survey_id: 1, question_id: 8, answer_id: 3, text: "Reconciliation"}) // correct
  const h2f_q8_a4 = await Survey_A.create({survey_id: 1, question_id: 8, answer_id: 4, text: "Empathy"})

  const h2f_q9    = await Survey_Q.create({survey_id: 1, question_id: 9, prompt: "Adults need at least how many hours of sleep per night?", type: "one"})
  const h2f_q9_a1 = await Survey_A.create({survey_id: 1, question_id: 9, answer_id: 1, text: "4-5 Hours"})
  const h2f_q9_a2 = await Survey_A.create({survey_id: 1, question_id: 9, answer_id: 2, text: "6-7 Hours"})
  const h2f_q9_a3 = await Survey_A.create({survey_id: 1, question_id: 9, answer_id: 3, text: "7-8 Hours"}) // correct
  const h2f_q9_a4 = await Survey_A.create({survey_id: 1, question_id: 9, answer_id: 4, text: "5-6 Hours"})

  const h2f_q10    = await Survey_Q.create({survey_id: 1, question_id: 10, prompt: "Being awake for more than 20 hours results in an impairment equal to a blood alcohol level of 0.08%.", type: "one"})
  const h2f_q10_a1 = await Survey_A.create({survey_id: 1, question_id: 10, answer_id: 1, text: "True"}) // correct
  const h2f_q10_a2 = await Survey_A.create({survey_id: 1, question_id: 10, answer_id: 2, text: "False"})

  const cpa_info = await Survey_Info.create({survey_id: 2, author: "brian.harder@army.mil", title: "Cogntive Performance Assessment", description: "This assessment is designed to measure your cognitive performance."})
  
  const cpa_q1    = await Survey_Q.create({survey_id: 2, question_id: 1, header: "Motivation to live a healthy lifestyle in each category", prompt: "M- Physical Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q1_a1 = await Survey_A.create({survey_id: 2, question_id: 1, answer_id: 1, text: "number"})
  const cpa_q2    = await Survey_Q.create({survey_id: 2, question_id: 2, prompt: "M- Mental Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q2_a1 = await Survey_A.create({survey_id: 2, question_id: 2, answer_id: 1, text: "number"})
  const cpa_q3    = await Survey_Q.create({survey_id: 2, question_id: 3, prompt: "M- Nutritional Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q3_a1 = await Survey_A.create({survey_id: 2, question_id: 3, answer_id: 1, text: "number"})
  const cpa_q4    = await Survey_Q.create({survey_id: 2, question_id: 4, prompt: "M- Spiritual Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q4_a1 = await Survey_A.create({survey_id: 2, question_id: 4, answer_id: 1, text: "number"})
  const cpa_q5    = await Survey_Q.create({survey_id: 2, question_id: 5, prompt: "M- Sleep Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q5_a1 = await Survey_A.create({survey_id: 2, question_id: 5, answer_id: 1, text: "number"})

  const cpa_q6     = await Survey_Q.create({survey_id: 2, question_id: 6, header: "Ability to live a healthy lifestyle in each category", prompt: "A- Physical Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q6_a1  = await Survey_A.create({survey_id: 2, question_id: 6, answer_id: 1, text: "number"})
  const cpa_q7     = await Survey_Q.create({survey_id: 2, question_id: 7, prompt: "A- Mental Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q7_a1  = await Survey_A.create({survey_id: 2, question_id: 7, answer_id: 1, text: "number"}) 
  const cpa_q8     = await Survey_Q.create({survey_id: 2, question_id: 8, prompt: "A- Nutritional Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q8_a1  = await Survey_A.create({survey_id: 2, question_id: 8, answer_id: 1, text: "number"})
  const cpa_q9     = await Survey_Q.create({survey_id: 2, question_id: 9, prompt: "A- Spiritual Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q9_a1  = await Survey_A.create({survey_id: 2, question_id: 9, answer_id: 1, text: "number"})
  const cpa_q10    = await Survey_Q.create({survey_id: 2, question_id: 10, prompt: "A- Sleep Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q10_a1 = await Survey_A.create({survey_id: 2, question_id: 10, answer_id: 1, text: "number"})
  
  const cpa_q11    = await Survey_Q.create({survey_id: 2, question_id: 11, header: "Current (past 7 days) in each category", prompt: "C- Physical Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q11_a1 = await Survey_A.create({survey_id: 2, question_id: 11, answer_id: 1, text: "number"})
  const cpa_q12    = await Survey_Q.create({survey_id: 2, question_id: 12, prompt: "C-Mental Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q12_a1 = await Survey_A.create({survey_id: 2, question_id: 12, answer_id: 1, text: "number"})
  const cpa_q13    = await Survey_Q.create({survey_id: 2, question_id: 13, prompt: "C-Nutritional Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q13_a1 = await Survey_A.create({survey_id: 2, question_id: 13, answer_id: 1, text: "number"})
  const cpa_q14    = await Survey_Q.create({survey_id: 2, question_id: 14, prompt: "C-Spiritual Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q14_a1 = await Survey_A.create({survey_id: 2, question_id: 14, answer_id: 1, text: "number"})
  const cpa_q15    = await Survey_Q.create({survey_id: 2, question_id: 15, prompt: "C-Sleep Health: ", type: "range", top_range: 10, bottom_range: 1})
  const cpa_q15_a1 = await Survey_A.create({survey_id: 2, question_id: 15, answer_id: 1, text: "number"})

  const fms_info = await Survey_Info.create({survey_id: 3, author: "brian.harder@army.mil", title: "Functional Movement Screening", description: "This assessment is designed to measure your functional movement.", secure: true, password: "1234"})

  const fms_q1    = await Survey_Q.create({survey_id: 3, question_id: 1, prompt: "Grader Name: ", type: "text"})
  const fms_q1_a1 = await Survey_A.create({survey_id: 3, question_id: 1, answer_id: 1, text: "Name"})
  const fms_q2    = await Survey_Q.create({survey_id: 3, question_id: 2, prompt: "Enter Athlete's Score for Deep Squat: ",img: "FMS/DeepSquat.png", type: "range", bottom_range: 0, top_range: 3})
  const fms_q2_a1 = await Survey_A.create({survey_id: 3, question_id: 2, answer_id: 1, text: "3"})
  const fms_q3    = await Survey_Q.create({survey_id: 3, question_id: 3, prompt: "Enter Athlete's Score for Hurdle Step: ",img: "FMS/HurdleStep.png", type: "range", bottom_range: 0, top_range: 3})
  const fms_q3_a1 = await Survey_A.create({survey_id: 3, question_id: 3, answer_id: 1, text: "3"})
  const fms_q4    = await Survey_Q.create({survey_id: 3, question_id: 4, prompt: "Enter Athlete's Score for Inline Lunge: ",img: "FMS/InlineLunge.png", type: "range", bottom_range: 0, top_range: 3})
  const fms_q4_a1 = await Survey_A.create({survey_id: 3, question_id: 4, answer_id: 1, text: "3"})
  const fms_q5    = await Survey_Q.create({survey_id: 3, question_id: 5, prompt: "Enter Athlete's Score for Shoulder Mobility: ",img: "FMS/ShoulderMobility.png", type: "range", bottom_range: 0, top_range: 3})
  const fms_q5_a1 = await Survey_A.create({survey_id: 3, question_id: 5, answer_id: 1, text: "3"})
  const fms_q6    = await Survey_Q.create({survey_id: 3, question_id: 6, prompt: "Enter Athlete's Score for Active Straight Leg Raise: ",img: "FMS/ActiveStraightLegRaise.png", type: "range", bottom_range: 0, top_range: 3})
  const fms_q6_a1 = await Survey_A.create({survey_id: 3, question_id: 6, answer_id: 1, text: "3"})
  const fms_q7    = await Survey_Q.create({survey_id: 3, question_id: 7, prompt: "Enter Athlete's Score for Trunk Stability Push-Up: ",img: "FMS/TrunkStabilityPushup.png", type: "range", bottom_range: 0, top_range: 3})
  const fms_q7_a1 = await Survey_A.create({survey_id: 3, question_id: 7, answer_id: 1, text: "3"})
  const fms_q8    = await Survey_Q.create({survey_id: 3, question_id: 8, prompt: "Enter Athlete's Score for Rotary Stability: ",img: "FMS/RotaryStability.png", type: "range", bottom_range: 0, top_range: 3})
  const fms_q8_a1 = await Survey_A.create({survey_id: 3, question_id: 8, answer_id: 1, text: "3"})

  

  /*

  const user1 = await User.create({ firstname: "Tom", lastname: "Hall", unit: "1st", email: "tom.hall@army.mil", rank: "Pvt" });
  const user2 = await User.create({ firstname: "Jill", lastname: "Shawn", unit: "1st", email: "jill.shawn@army.mil", rank: "Pvt" });
  const user3 = await User.create({ firstname: "Joe", lastname: "Johnson", unit: "1st", email: "joe.johnson@army.mil", rank: "Sgt" });
  const user4 = await User.create({ firstname: "Adam", lastname: "Smith", unit: "1st", email: "adam.smith@army.mil", rank: "Cpl" });
  const user5 = await User.create({ firstname: "John", lastname: "Don", unit: "1st", email: "john.don@army.mil", rank: "Pvt" });
  const user6 = await User.create({ firstname: "Jane", lastname: "Jackson", unit: "1st", email: "jane.jackson@army.mil", rank: "Sgt" });
  const user7 = await User.create({ firstname: "Mike", lastname: "Smith", unit: "1st", email: "mike.smith@army.mil", rank: "Pvt" });
  const user8 = await User.create({ firstname: "Emily", lastname: "Jones", unit: "1st", email: "emily.jones@army.mil", rank: "Pvt" });
  const user9 = await User.create({ firstname: "David", lastname: "Brown", unit: "1st", email: "david.brown@army.mil", rank: "Sgt" });
  const user10 = await User.create({ firstname: "Amy", lastname: "Wilson", unit: "1st", email: "amy.wilson@army.mil", rank: "Pvt" });
  const user11 = await User.create({ firstname: "Mark", lastname: "Taylor", unit: "1st", email: "mark.taylor@army.mil", rank: "Pvt" });
  const user12 = await User.create({ firstname: "Karen", lastname: "Anderson", unit: "1st", email: "karen.anderson@army.mil", rank: "Sgt" });
  const user13 = await User.create({ firstname: "Chris", lastname: "Lee", unit: "1st", email: "chris.lee@army.mil", rank: "Pvt" });
  const user14 = await User.create({ firstname: "Lisa", lastname: "Kim", unit: "1st", email: "lisa.kim@army.mil", rank: "Pvt" });
  const user15 = await User.create({ firstname: "Brian", lastname: "Chen", unit: "1st", email: "brian.chen@army.mil", rank: "Sgt" });
  const user16 = await User.create({ firstname: "Jessica", lastname: "Wang", unit: "1st", email: "jessica.wang@army.mil", rank: "Pvt" });
  const user17 = await User.create({ firstname: "Kevin", lastname: "Zhang", unit: "1st", email: "kevin.zhang@army.mil", rank: "Pvt" });
  const user18 = await User.create({ firstname: "Michelle", lastname: "Li", unit: "1st", email: "michelle.li@army.mil", rank: "Sgt" });
  const user19 = await User.create({ firstname: "Andrew", lastname: "Wu", unit: "1st", email: "andrew.wu@army.mil", rank: "Pvt" });
  const user20 = await User.create({ firstname: "Stephanie", lastname: "Chang", unit: "1st", email: "stephanie.chang@army.mil", rank: "Pvt" });
  const user21 = await User.create({ firstname: "Jason", lastname: "Chen", unit: "1st", email: "jason.chen@army.mil", rank: "Sgt" });
  const user22 = await User.create({ firstname: "Rachel", lastname: "Liu", unit: "1st", email: "rachel.liu@army.mil", rank: "Pvt" });
  const user23 = await User.create({ firstname: "Eric", lastname: "Wang", unit: "1st", email: "eric.wang@army.mil", rank: "Pvt" });
  const user24 = await User.create({ firstname: "Catherine", lastname: "Zhang", unit: "1st", email: "catherine.zhang@army.mil", rank: "Sgt" });
  const user25 = await User.create({ firstname: "Justin", lastname: "Chen", unit: "1st", email: "justin.chen@army.mil", rank: "Pvt" });
  const user26 = await User.create({ firstname: "Grace", lastname: "Wu", unit: "1st", email: "grace.wu@army.mil", rank: "Pvt" });
  const user27 = await User.create({ firstname: "Steven", lastname: "Liu", unit: "1st", email: "steven.liu@army.mil", rank: "Sgt" });

  let res1 = { 1: 4, 2: 7, 3: 10, 4: 14, 5: 17, 6: 23, 7: 28, 8: 31, 9: 35, 10: 37 } // full score 10
  let res2 = { 1: 4, 2: 8, 3: 10, 4: 15, 5: 17, 6: 23, 7: 25, 8: 31, 9: 34, 10: 38 } // score 5
  let res3 = { 1: 3, 2: 7, 3: 9, 4: 14, 5: 17, 6: 24, 7: 28, 8: 31, 9: 35, 10: 37 } // score 7
  let res4 = { 1: 1, 2: 8, 3: 11, 4: 16, 5: 18, 6: 22, 7: 25, 8: 32, 9: 34, 10: 38 } // score 0 
  let res5 = { 1: 2, 2: 6, 3: 10, 4: 15, 5: 17, 6: 24, 7: 28, 8: 32, 9: 36, 10: 38 } // score 3
  let res6 = { 1: 4, 2: 8, 3: 9, 4: 14, 5: 18, 6: 22, 7: 27, 8: 31, 9: 33, 10: 38 } // score 3
  let res7 = { 1: 1, 2: 8, 3: 12, 4: 16, 5: 19, 6: 21, 7: 28, 8: 31, 9: 35, 10: 37 } // score 4
  let res8 = { 1: 4, 2: 8, 3: 10, 4: 14, 5: 17, 6: 23, 7: 28, 8: 32, 9: 35, 10: 37 } // score 8
  let res9 = { 1: 4, 2: 7, 3: 10, 4: 14, 5: 17, 6: 23, 7: 28, 8: 31, 9: 35, 10: 37 } // score 2
  let res10 = { 1: 2, 2: 5, 3: 11, 4: 13, 5: 20, 6: 21, 7: 25, 8: 29, 9: 33, 10: 37 } // score 1
  let res11 = { 1: 4, 2: 7, 3: 10, 4: 16, 5: 17, 6: 23, 7: 28, 8: 31, 9: 35, 10: 37 } // score 9
  let res12 = { 1: 4, 2: 7, 3: 10, 4: 14, 5: 17, 6: 23, 7: 25, 8: 31, 9: 35, 10: 37 } // score 9
  let res13 = { 1: 1, 2: 6, 3: 10, 4: 14, 5: 17, 6: 23, 7: 28, 8: 31, 9: 35, 10: 38 } // score 7

  const user1_res = await H2F_R.create({ email: "tom.hall@army.mil", unit: "1st", results: JSON.stringify(res1), score: 10 })
  const user2_res = await H2F_R.create({ email: "jill.shawn@army.mil", unit: "1st", results: JSON.stringify(res2), score: 5 })
  const user3_res = await H2F_R.create({ email: "joe.johnson@army.mil", unit: "1st", results: JSON.stringify(res3), score: 7 })
  const user4_res = await H2F_R.create({ email: "adam.smith@army.mil", unit: "1st", results: JSON.stringify(res4), score: 0 })
  const user5_res = await H2F_R.create({ email: "john.don@army.mil", unit: "1st", results: JSON.stringify(res5), score: 3 })
  const user6_res = await H2F_R.create({ email: "jane.jackson@army.mil", unit: "1st", results: JSON.stringify(res6), score: 3 })
  const user7_res = await H2F_R.create({ email: "mike.smith@army.mil", unit: "1st", results: JSON.stringify(res7), score: 4 })
  const user8_res = await H2F_R.create({ email: "emily.jones@army.mil", unit: "1st", results: JSON.stringify(res8), score: 8 })
  const user9_res = await H2F_R.create({ email: "david.brown@army.mil", unit: "1st", results: JSON.stringify(res9), score: 2 })
  const user10_res = await H2F_R.create({ email: "amy.wilson@army.mil", unit: "1st", results: JSON.stringify(res10), score: 1 })
  const user11_res = await H2F_R.create({ email: "mark.taylor@army.mil", unit: "1st", results: JSON.stringify(res11), score: 9 })
  const user12_res = await H2F_R.create({ email: "karen.anderson@army.mil", unit: "1st", results: JSON.stringify(res12), score: 9 })
  const user13_res = await H2F_R.create({ email: "chris.lee@army.mil", unit: "1st", results: JSON.stringify(res13), score: 7 })
  const user14_res = await H2F_R.create({ email: "lisa.kim@army.mil", unit: "1st", results: JSON.stringify(res1), score: 10 })
  const user15_res = await H2F_R.create({ email: "brian.chen@army.mil", unit: "1st", results: JSON.stringify(res2), score: 5 })
  const user16_res = await H2F_R.create({ email: "jessica.wang@army.mil", unit: "1st", results: JSON.stringify(res3), score: 7 })
  const user17_res = await H2F_R.create({ email: "kevin.zhang@army.mil", unit: "1st", results: JSON.stringify(res4), score: 0 })
  const user18_res = await H2F_R.create({ email: "michelle.li@army.mil", unit: "1st", results: JSON.stringify(res5), score: 3 })
  const user19_res = await H2F_R.create({ email: "andrew.wu@army.mil", unit: "1st", results: JSON.stringify(res6), score: 3 })
  const user20_res = await H2F_R.create({ email: "stephanie.chang@army.mil", unit: "1st", results: JSON.stringify(res7), score: 4 })
  const user21_res = await H2F_R.create({ email: "jason.chen@army.mil", unit: "1st", results: JSON.stringify(res8), score: 8 })
  const user22_res = await H2F_R.create({ email: "rachel.liu@army.mil", unit: "1st", results: JSON.stringify(res9), score: 2 })
  const user23_res = await H2F_R.create({ email: "eric.wang@army.mil", unit: "1st", results: JSON.stringify(res10), score: 1 })
  const user24_res = await H2F_R.create({ email: "catherine.zhang@army.mil", unit: "1st", results: JSON.stringify(res11), score: 9 })
  const user25_res = await H2F_R.create({ email: "justin.chen@army.mil", unit: "1st", results: JSON.stringify(res12), score: 9 })
  const user26_res = await H2F_R.create({ email: "grace.wu@army.mil", unit: "1st", results: JSON.stringify(res13), score: 7 })
  const user27_res = await H2F_R.create({ email: "steven.liu@army.mil", unit: "1st", results: JSON.stringify(res1), score: 10 })
  const user28_res = await H2F_R.create({ email: "brian.harder@army.mil", unit: "1st", results: JSON.stringify(res1), score: 10 })

  const fms1_res = await FMS_R.create({
    email: "brian.harder@army.mil", unit: "1st", deep_squat: 3, hurdle_step: 3, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 3, trunk_stability_pushup: 3, rotary_stability: 3, score: 21, fms_grader: "Tom Brady"
  })
  const fms2_res = await FMS_R.create({
    email: "adam.smith@army.mil", unit: "1st", deep_squat: 2, hurdle_step: 2, inline_lunge: 2, shoulder_mobility: 2,
    active_straight_leg_raise: 2, trunk_stability_pushup: 2, rotary_stability: 2, score: 14, fms_grader: "Dak Prescott"
  })
  const fms3_res = await FMS_R.create({
    email: "john.don@army.mil", unit: "1st", deep_squat: 1, hurdle_step: 1, inline_lunge: 1, shoulder_mobility: 1,
    active_straight_leg_raise: 1, trunk_stability_pushup: 1, rotary_stability: 1, score: 7, fms_grader: "Russell Wilson"
  })
  const fms4_res = await FMS_R.create({
    email: "jane.jackson@army.mil", unit: "1st", deep_squat: 3, hurdle_step: 1, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 3, trunk_stability_pushup: 3, rotary_stability: 1, score: 17, fms_grader: "Geno Smith"
  })
  const fms5_res = await FMS_R.create({
    email: "mike.smith@army.mil", unit: "1st", deep_squat: 1, hurdle_step: 3, inline_lunge: 1, shoulder_mobility: 2,
    active_straight_leg_raise: 3, trunk_stability_pushup: 2, rotary_stability: 3, score: 15, fms_grader: "Brock Purdy"
  })
  const fms6_res = await FMS_R.create({
    email: "emily.jones@army.mil", unit: "1st", deep_squat: 1, hurdle_step: 0, inline_lunge: 1, shoulder_mobility: 2,
    active_straight_leg_raise: 3, trunk_stability_pushup: 3, rotary_stability: 3, score: 13, fms_grader: "Sam Howell"
  })
  const fms7_res = await FMS_R.create({
    email: "david.brown@army.mil", unit: "1st", deep_squat: 3, hurdle_step: 3, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 2, trunk_stability_pushup: 3, rotary_stability: 2, score: 19, fms_grader: "Matthew Stafford"
  })
  const fms8_res = await FMS_R.create({
    email: "amy.wilson@army.mil", unit: "1st", deep_squat: 0, hurdle_step: 3, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 0, trunk_stability_pushup: 3, rotary_stability: 0, score: 12, fms_grader: "Kyler Murray"
  })
  const fms9_res = await FMS_R.create({
    email: "mark.taylor@army.mil", unit: "1st", deep_squat: 1, hurdle_step: 2, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 0, trunk_stability_pushup: 1, rotary_stability: 3, score: 13, fms_grader: "Trevor Lawrence"
  })
  const fms10_res = await FMS_R.create({
    email: "karen.anderson@army.mil", unit: "1st", deep_squat: 2, hurdle_step: 3, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 3, trunk_stability_pushup: 2, rotary_stability: 2, score: 18, fms_grader: "Tua Tagovailoa"
  })
  const fms11_res = await FMS_R.create({
    email: "chris.lee@army.mil", unit: "1st", deep_squat: 3, hurdle_step: 0, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 3, trunk_stability_pushup: 3, rotary_stability: 3, score: 18, fms_grader: "Justin Fields"
  })
  const fms12_res = await FMS_R.create({
    email: "lisa.kim@army.mil", unit: "1st", deep_squat: 2, hurdle_step: 2, inline_lunge: 2, shoulder_mobility: 2,
    active_straight_leg_raise: 2, trunk_stability_pushup: 2, rotary_stability: 2, score: 14, fms_grader: "Lamar Jackson"
  })
  const fms13_res = await FMS_R.create({
    email: "brian.chen@army.mil", unit: "1st", deep_squat: 3, hurdle_step: 3, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 3, trunk_stability_pushup: 3, rotary_stability: 2, score: 20, fms_grader: "Joe Burrow"
  })
  const fms14_res = await FMS_R.create({
    email: "jessica.wang@army.mil", unit: "1st", deep_squat: 3, hurdle_step: 3, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 3, trunk_stability_pushup: 3, rotary_stability: 3, score: 21, fms_grader: "Patrick Mahomes"
  })
  const fms15_res = await FMS_R.create({
    email: "kevin.zhang@army.mil", unit: "1st", deep_squat: 3, hurdle_step: 2, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 2, trunk_stability_pushup: 3, rotary_stability: 3, score: 19, fms_grader: "Aaron Rodgers"
  })
  const fms16_res = await FMS_R.create({
    email: "michelle.li@army.mil", unit: "1st", deep_squat: 2, hurdle_step: 3, inline_lunge: 2, shoulder_mobility: 3,
    active_straight_leg_raise: 3, trunk_stability_pushup: 3, rotary_stability: 2, score: 18, fms_grader: "Justin Herbert"
  })
  const fms17_res = await FMS_R.create({
    email: "andrew.wu@army.mil", unit: "1st", deep_squat: 3, hurdle_step: 1, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 3, trunk_stability_pushup: 3, rotary_stability: 3, score: 19, fms_grader: "Josh Allen"
  })
  const fms18_res = await FMS_R.create({
    email: "stephanie.chang@army.mil", unit: "1st", deep_squat: 3, hurdle_step: 1, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 3, trunk_stability_pushup: 3, rotary_stability: 1, score: 17, fms_grader: "Bryce Young"
  })
  const fms19_res = await FMS_R.create({
    email: "jason.chen@army.mil", unit: "1st", deep_squat: 1, hurdle_step: 1, inline_lunge: 1, shoulder_mobility: 1,
    active_straight_leg_raise: 1, trunk_stability_pushup: 1, rotary_stability: 1, score: 7, fms_grader: "C.J. Stroud"
  })
  const fms21_res = await FMS_R.create({
    email: "rachel.liu@army.mil", unit: "1st", deep_squat: 2, hurdle_step: 2, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 2, trunk_stability_pushup: 2, rotary_stability: 2, score: 16, fms_grader: "Anthony Richardson"
  })
  const fms22_res = await FMS_R.create({
    email: "eric.wang@army.mil", unit: "1st", deep_squat: 1, hurdle_step: 2, inline_lunge: 3, shoulder_mobility: 1,
    active_straight_leg_raise: 2, trunk_stability_pushup: 3, rotary_stability: 1, score: 13, fms_grader: "Kirk Cousins"
  })
  const fms23_res = await FMS_R.create({
    email: "catherine.zhang@army.mil", unit: "1st", deep_squat: 2, hurdle_step: 2, inline_lunge: 3, shoulder_mobility: 1,
    active_straight_leg_raise: 2, trunk_stability_pushup: 3, rotary_stability: 1, score: 14, fms_grader: "Derek Carr"
  })
  const fms24_res = await FMS_R.create({
    email: "justin.chen@army.mil", unit: "1st", deep_squat: 3, hurdle_step: 2, inline_lunge: 3, shoulder_mobility: 3,
    active_straight_leg_raise: 3, trunk_stability_pushup: 3, rotary_stability: 3, score: 20, fms_grader: "Jalen Hurts"
  })
  const fms25_res = await FMS_R.create({
    email: "grace.wu@army.mil", unit: "1st", deep_squat: 1, hurdle_step: 2, inline_lunge: 1, shoulder_mobility: 0,
    active_straight_leg_raise: 1, trunk_stability_pushup: 2, rotary_stability: 1, score: 8, fms_grader: "Daniel Jones"
  })
  const fms26_res = await FMS_R.create({
    email: "steven.liu@army.mil", unit: "1st", deep_squat: 0, hurdle_step: 0, inline_lunge: 0, shoulder_mobility: 0,
    active_straight_leg_raise: 0, trunk_stability_pushup: 0, rotary_stability: 3, score: 0, fms_grader: "Baker Mayfield"
  })




  const cpa1_res = await CPA_R.create({
    email: "brian.harder@army.mil", unit: "1st",
    motivation_physical: 10, motivation_mental: 10, motivation_nutritional: 10, motivation_spiritual: 10, motivation_sleep: 10, total_score: 50,
    abilityPH: 10, abilityMH: 10, abilityNH: 10, abilitySPH: 10, abilitySLH: 10, abilityTS: 50,
    curPH: 10, curMH: 10, curNH: 10, curSPH: 10, curSLH: 10, curTS: 50
  })
  const cpa2_res = await CPA_R.create({
    email: "adam.smith@army.mil", unit: "1st",
    motivation_physical: 10, motivation_mental: 5, motivation_nutritional: 3, motivation_spiritual: 7, motivation_sleep: 10, total_score: 35,
    abilityPH: 10, abilityMH: 10, abilityNH: 8, abilitySPH: 9, abilitySLH: 10, abilityTS: 47,
    curPH: 7, curMH: 1, curNH: 2, curSPH: 10, curSLH: 6, curTS: 26
  })
  const cpa3_res = await CPA_R.create({
    email: "john.don@army.mil", unit: "1st",
    motivation_physical: 10, motivation_mental: 8, motivation_nutritional: 9, motivation_spiritual: 10, motivation_sleep: 7, total_score: 34,
    abilityPH: 9, abilityMH: 8, abilityNH: 6, abilitySPH: 7, abilitySLH: 6, abilityTS: 36,
    curPH: 7, curMH: 8, curNH: 6, curSPH: 7, curSLH: 6, curTS: 34
  })
  const cpa4_res = await CPA_R.create({
    email: "jane.jackson@army.mil", unit: "1st",
    motivation_physical: 9, motivation_mental: 8, motivation_nutritional: 9, motivation_spiritual: 8, motivation_sleep: 9, total_score: 43,
    abilityPH: 7, abilityMH: 6, abilityNH: 4, abilitySPH: 5, abilitySLH: 6, abilityTS: 28,
    curPH: 5, curMH: 6, curNH: 4, curSPH: 3, curSLH: 7 , curTS: 25
  })
  const cpa5_res = await CPA_R.create({
    email: "mike.smith@army.mil", unit: "1st",
    motivation_physical: 6, motivation_mental: 7, motivation_nutritional: 1, motivation_spiritual: 6, motivation_sleep: 5, total_score: 25,
    abilityPH: 6, abilityMH: 3, abilityNH: 7, abilitySPH: 8, abilitySLH: 9, abilityTS: 33,
    curPH: 9, curMH: 9, curNH: 5, curSPH: 2, curSLH: 5, curTS: 30
  })
  const cpa6_res = await CPA_R.create({
    email: "emily.jones@army.mil", unit: "1st",
    motivation_physical: 3, motivation_mental: 4, motivation_nutritional: 7, motivation_spiritual: 4, motivation_sleep: 5, total_score: 23,
    abilityPH: 4, abilityMH: 6, abilityNH: 8, abilitySPH: 3, abilitySLH: 7, abilityTS: 28,
    curPH: 3, curMH: 7, curNH: 2, curSPH: 4, curSLH: 3, curTS: 19
  })
  const cpa7_res = await CPA_R.create({
    email: "david.brown@army.mil", unit: "1st",
    motivation_physical: 8, motivation_mental: 7, motivation_nutritional: 4, motivation_spiritual: 5, motivation_sleep: 7, total_score: 31,
    abilityPH: 6, abilityMH: 6, abilityNH: 4, abilitySPH: 3, abilitySLH: 4, abilityTS: 23,
    curPH: 4, curMH: 5, curNH: 7, curSPH: 8, curSLH: 9, curTS: 33
  })
  const cpa8_res = await CPA_R.create({
    email: "amy.wilson@army.mil", unit: "1st",
    motivation_physical: 9, motivation_mental: 8, motivation_nutritional: 10, motivation_spiritual: 9, motivation_sleep: 7, total_score: 43,
    abilityPH: 10, abilityMH: 7, abilityNH: 8, abilitySPH: 7, abilitySLH: 9, abilityTS: 41,
    curPH: 7, curMH: 9, curNH: 8, curSPH: 8, curSLH: 8, curTS: 40
  })
  const cpa9_res = await CPA_R.create({
    email: "mark.taylor@army.mil", unit: "1st",
    motivation_physical: 8, motivation_mental: 7, motivation_nutritional: 6, motivation_spiritual: 5, motivation_sleep: 6, total_score: 32,
    abilityPH: 7, abilityMH: 5, abilityNH: 7, abilitySPH: 4, abilitySLH: 9, abilityTS: 32,
    curPH: 6, curMH: 8, curNH: 10, curSPH: 8, curSLH: 9, curTS: 41
  })
  const cpa10_res = await CPA_R.create({
    email: "karen.anderson@army.mil", unit: "1st",
    motivation_physical: 9, motivation_mental: 9, motivation_nutritional: 8, motivation_spiritual: 7, motivation_sleep: 6, total_score: 39,
    abilityPH: 8, abilityMH: 7, abilityNH: 6, abilitySPH: 5, abilitySLH: 4, abilityTS: 30,
    curPH: 7, curMH: 4, curNH: 9, curSPH: 10, curSLH: 6, curTS: 36  
  })
  const cpa11_res = await CPA_R.create({
    email: "chris.lee@army.mil", unit: "1st",
    motivation_physical: 8, motivation_mental: 4, motivation_nutritional: 6, motivation_spiritual: 8, motivation_sleep: 5, total_score: 31,
    abilityPH: 8, abilityMH: 6, abilityNH: 7, abilitySPH: 9, abilitySLH: 10, abilityTS: 40,
    curPH: 6, curMH: 8, curNH: 9, curSPH: 10, curSLH: 5, curTS: 38
  })
  const cpa12_res = await CPA_R.create({
    email: "lisa.kim@army.mil", unit: "1st",
    motivation_physical: 3, motivation_mental: 4, motivation_nutritional: 5, motivation_spiritual: 5, motivation_sleep: 2, total_score: 19,
    abilityPH: 4, abilityMH: 2, abilityNH: 5, abilitySPH: 4, abilitySLH: 5, abilityTS: 20,
    curPH: 1, curMH: 3, curNH: 2, curSPH: 3, curSLH: 3, curTS: 12
  })
  const cpa13_res = await CPA_R.create({
    email: "brian.chen@army.mil", unit: "1st",
    motivation_physical: 4, motivation_mental: 3, motivation_nutritional: 6, motivation_spiritual: 6, motivation_sleep: 6, total_score: 25,
    abilityPH: 5, abilityMH: 8, abilityNH: 9, abilitySPH: 10, abilitySLH: 8, abilityTS: 40,
    curPH: 5, curMH: 8, curNH: 8, curSPH: 6, curSLH: 6, curTS: 33
  })
  const cpa14_res = await CPA_R.create({
    email: "jessica.wang@army.mil", unit: "1st",
    motivation_physical: 7, motivation_mental: 5, motivation_nutritional: 4, motivation_spiritual: 3, motivation_sleep: 1, total_score: 20,
    abilityPH: 4, abilityMH: 5, abilityNH: 7, abilitySPH: 6, abilitySLH: 7, abilityTS: 29,
    curPH: 5, curMH: 8, curNH: 4, curSPH: 5, curSLH: 7, curTS: 29
  })
  const cpa15_res = await CPA_R.create({
    email: "kevin.zhang@army.mil", unit: "1st",
    motivation_physical: 4, motivation_mental: 6, motivation_nutritional: 7, motivation_spiritual: 3, motivation_sleep: 4, total_score: 24,
    abilityPH: 5, abilityMH: 7, abilityNH: 4, abilitySPH: 6, abilitySLH: 5, abilityTS: 27,
    curPH: 7, curMH: 9, curNH: 8, curSPH: 6, curSLH: 6, curTS: 36
  })
  const cpa16_res = await CPA_R.create({
    email: "michelle.li@army.mil", unit: "1st",
    motivation_physical: 8, motivation_mental: 7, motivation_nutritional: 9, motivation_spiritual: 6, motivation_sleep: 8, total_score: 38,
    abilityPH: 7, abilityMH: 6, abilityNH: 8, abilitySPH: 3, abilitySLH: 6, abilityTS: 30,
    curPH: 4, curMH: 7, curNH: 4, curSPH: 9, curSLH: 10, curTS: 34
  })
  const cpa17_res = await CPA_R.create({
    email: "andrew.wu@army.mil", unit: "1st",
    motivation_physical: 8, motivation_mental: 8, motivation_nutritional: 5, motivation_spiritual: 6, motivation_sleep: 6, total_score: 33,
    abilityPH: 4, abilityMH: 8, abilityNH: 8, abilitySPH: 8, abilitySLH: 6, abilityTS: 34,
    curPH: 5, curMH: 9, curNH: 8, curSPH: 9, curSLH: 6, curTS: 37
  })
  const cpa18_res = await CPA_R.create({
    email: "stephanie.chang@army.mil", unit: "1st",
    motivation_physical: 6, motivation_mental: 8, motivation_nutritional: 9, motivation_spiritual: 8, motivation_sleep: 8, total_score: 39,
    abilityPH: 8, abilityMH: 7, abilityNH: 9, abilitySPH: 7, abilitySLH: 10, abilityTS: 41,
    curPH: 8, curMH: 7, curNH: 9, curSPH: 10, curSLH: 10, curTS: 44
  })
  const cpa19_res = await CPA_R.create({
    email: "jason.chen@army.mil", unit: "1st",
    motivation_physical: 7, motivation_mental: 8, motivation_nutritional: 9, motivation_spiritual: 5, motivation_sleep: 8, total_score: 37,
    abilityPH: 8, abilityMH: 6, abilityNH: 5, abilitySPH: 9, abilitySLH: 4, abilityTS: 32,
    curPH: 7, curMH: 8, curNH: 6, curSPH: 7, curSLH: 10, curTS: 38
  })
  const cpa20_res = await CPA_R.create({
    email: "rachel.liu@army.mil", unit: "1st",
    motivation_physical: 7, motivation_mental: 7, motivation_nutritional: 7, motivation_spiritual: 8, motivation_sleep: 9, total_score: 38,
    abilityPH: 8, abilityMH: 8, abilityNH: 8, abilitySPH: 9, abilitySLH: 10, abilityTS: 43,
    curPH: 9, curMH: 9, curNH: 9, curSPH: 9, curSLH: 9, curTS: 45
  })
  const cpa21_res = await CPA_R.create({
    email: "eric.wang@army.mil", unit: "1st",
    motivation_physical: 8, motivation_mental: 5, motivation_nutritional: 6, motivation_spiritual: 7, motivation_sleep: 4, total_score: 30,
    abilityPH: 5, abilityMH: 3, abilityNH: 4, abilitySPH: 3, abilitySLH: 4, abilityTS: 19,
    curPH: 5, curMH: 6, curNH: 7, curSPH: 3, curSLH: 5, curTS: 26
  })
  const cpa22_res = await CPA_R.create({
    email: "catherine.zhang@army.mil", unit: "1st",
    motivation_physical: 4, motivation_mental: 6, motivation_nutritional: 8, motivation_spiritual: 6, motivation_sleep: 7, total_score: 31,
    abilityPH: 5, abilityMH: 7, abilityNH: 5, abilitySPH: 7, abilitySLH: 4, abilityTS: 28,
    curPH: 7, curMH: 6, curNH: 8, curSPH: 9, curSLH: 10, curTS: 40
  })
  const cpa23_res = await CPA_R.create({
    email: "justin.chen@army.mil", unit: "1st",
    motivation_physical: 7, motivation_mental: 7, motivation_nutritional: 7, motivation_spiritual: 6, motivation_sleep: 7, total_score: 34,
    abilityPH: 7, abilityMH: 9, abilityNH: 8, abilitySPH: 6, abilitySLH: 8, abilityTS: 38,  
    curPH: 7, curMH: 9, curNH: 10, curSPH: 7, curSLH: 9, curTS: 42
  })
  const cpa24_res = await CPA_R.create({
    email: "grace.wu@army.mil", unit: "1st",
    motivation_physical: 9, motivation_mental: 9, motivation_nutritional: 9, motivation_spiritual: 9, motivation_sleep: 9, total_score: 45,
    abilityPH: 9, abilityMH: 9, abilityNH: 9, abilitySPH: 9, abilitySLH: 9, abilityTS: 45,
    curPH: 9, curMH: 9, curNH: 9, curSPH: 9, curSLH: 9, curTS: 45
  })
  const cpa25_res = await CPA_R.create({
    email: "steven.liu@army.mil", unit: "1st",
    motivation_physical: 10, motivation_mental: 10, motivation_nutritional: 10, motivation_spiritual: 10, motivation_sleep: 10, total_score: 50,
    abilityPH: 10, abilityMH: 10, abilityNH: 10, abilitySPH: 10, abilitySLH: 10, abilityTS: 50,
    curPH: 10, curMH: 10, curNH: 10, curSPH: 10, curSLH: 10, curTS: 50
  })


  const cpaUser = await User.create({ firstname: "James", lastname: "Bond", unit: "1st", email: "james.bond@army.mil", rank: "Sgt" })
  */


  console.log("Data Entered")
}


sequelize.sync({ force: true, alter: true }).then(() => {
  console.log("Database synced")
  setup().then(() => console.log("Setup completed"))
})

module.exports = app;
