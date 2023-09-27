var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const sequelize = require('./db');
const User = require('./models/User')

const Survey_Info = require('./models/Survey/Survey_Info')
const Survey_Q = require('./models/Survey/Survey_Q')
const Survey_A = require('./models/Survey/Survey_A')
const Survey_R = require('./models/Survey/Survey_R');

Survey_Info.hasMany(Survey_Q, { foreignKey: "survey_id" })
Survey_Q.belongsTo(Survey_Info)
Survey_Q.hasMany(Survey_A, { foreignKey: "question_id" })
Survey_Q.hasMany(Survey_A, { foreignKey: "survey_id" })
Survey_A.belongsTo(Survey_Q)
Survey_A.belongsTo(Survey_Info)
User.hasMany(Survey_R, { foreignKey: "user_id" })
Survey_Info.hasMany(Survey_R, { foreignKey: "survey_id" })
Survey_R.belongsTo(Survey_Info)
Survey_R.belongsTo(User)

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');
var aboutRouter = require('./routes/about');
var createRouter = require('./routes/create');
var unitsummaryRouter = require('./routes/unitsummary');

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
app.use('/create', createRouter);
app.use('/unitsummary', unitsummaryRouter);

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

  const survey_one       = await Survey_Info.create({ author: "brian.harder@army.mil", title: "Survey One", description: "This is a test survey"})
  const survey_one_q2    = await Survey_Q.create({survey_id: 1, question_id: 1, prompt: "What is the capital of Washington State?", type: "multiple_choice"})
  const survey_one_q2_a1 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 1, text: "Seattle"})
  const survey_one_q2_a2 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 2, text: "Pullman"})
  const survey_one_q2_a3 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 3, text: "Olympia"})
  const survey_one_q2_a4 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 4, text: "Vancouver"})
  const survey_one_q3    = await Survey_Q.create({survey_id: 1, question_id: 2, prompt: "Enter you name please?", type: "text"})
  const survey_one_q3_a1 = await Survey_A.create({survey_id: 1, question_id: 2, answer_id: 1, text: "Name"})
  const survey_one_q4    = await Survey_Q.create({survey_id: 1, question_id: 3, prompt: "What is your favorite number from 5-10?", type: "number_range", top_range: 10, bottom_range: 5})
  const survey_one_q4_a1 = await Survey_A.create({survey_id: 1, question_id: 3, answer_id: 1, text: "number"})
  const survey_one_q5    = await Survey_Q.create({survey_id: 1, question_id: 4, prompt: "Select all the classes that you have taken:", type: "checkbox"})
  const survey_one_q5_a1 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 1, text: "CPT_S 302"})
  const survey_one_q5_a2 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 2, text: "CPT_S 350"})
  const survey_one_q5_a3 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 3, text: "CPT_S 360"})
  const survey_one_q5_a4 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 4, text: "CPT_S 421"})
  const survey_one_q6    = await Survey_Q.create({survey_id: 1, question_id: 5, prompt: "Can you see the following image",img: "FMS/DeepSquat.png", type: "multiple_choice"})
  const survey_one_q6_a1 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 1, text: "Yes"})
  const survey_one_q6_a2 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 2, text: "No"})

  const h2f_info = await Survey_Info.create({author: "brian.harder@army.mil", title: "Holistic Health and Fitness (H2F) Knowledge Check", description: "H2F is designed to optimize Soldier personal readiness,\
  reduce injury rates, improve rehabilitation after injury, and increase the overall effectiveness of the Total Army. These assessment tools are designed to help you identify your strengths\
   and weaknesses in the areas of Holistic Health and Fitness and must be completed by all members of the Army National Guard along with the PHA.", show_question_numbers: true, grade_by_points: true})

  const h2f_q1    = await Survey_Q.create({survey_id: 2, question_id: 1, prompt: "How long should you cool down after a workout?", type: "multiple_choice", point_value: 1})
  const h2f_q1_a1 = await Survey_A.create({survey_id: 2, question_id: 1, answer_id: 1, text: "30 minutes"})
  const h2f_q1_a2 = await Survey_A.create({survey_id: 2, question_id: 1, answer_id: 2, text: "75 minutes"})
  const h2f_q1_a3 = await Survey_A.create({survey_id: 2, question_id: 1, answer_id: 3, text: "300 minutes"})
  const h2f_q1_a4 = await Survey_A.create({survey_id: 2, question_id: 1, answer_id: 4, text: "150 minutes", is_correct: true}) // correct

  const h2f_q2    = await Survey_Q.create({survey_id: 2, question_id: 2, prompt: "All of the following can be results of doing a proper cool down after exercise EXCEPT:", type: "multiple_choice", point_value: 1})
  const h2f_q2_a1 = await Survey_A.create({survey_id: 2, question_id: 2, answer_id: 1, text: "Slowly reducing heart rate"})
  const h2f_q2_a2 = await Survey_A.create({survey_id: 2, question_id: 2, answer_id: 2, text: "Preventing blood pooling in the extremities"})
  const h2f_q2_a3 = await Survey_A.create({survey_id: 2, question_id: 2, answer_id: 3, text: "Increase the body's ability to burn fat", is_correct: true}) // correct
  const h2f_q2_a4 = await Survey_A.create({survey_id: 2, question_id: 2, answer_id: 4, text: "Enhancing Flexibility and range of motion"})

  const h2f_q3    = await Survey_Q.create({survey_id: 2, question_id: 3, prompt: "Which of the following is not a food group:", type: "multiple_choice", point_value: 1})
  const h2f_q3_a1 = await Survey_A.create({survey_id: 2, question_id: 3, answer_id: 1, text: "Fruits"})
  const h2f_q3_a2 = await Survey_A.create({survey_id: 2, question_id: 3, answer_id: 2, text: "Rice", is_correct: true}) // correct
  const h2f_q3_a3 = await Survey_A.create({survey_id: 2, question_id: 3, answer_id: 3, text: "Grains"})
  const h2f_q3_a4 = await Survey_A.create({survey_id: 2, question_id: 3, answer_id: 4, text: "Protein"})

  const h2f_q4    = await Survey_Q.create({survey_id: 2, question_id: 4, prompt: "All of the following are examples of whole grains except:", type: "multiple_choice", point_value: 1})
  const h2f_q4_a1 = await Survey_A.create({survey_id: 2, question_id: 4, answer_id: 1, text: "Brown Rice"})
  const h2f_q4_a2 = await Survey_A.create({survey_id: 2, question_id: 4, answer_id: 2, text: "White Bread", is_correct: true}) // correct
  const h2f_q4_a3 = await Survey_A.create({survey_id: 2, question_id: 4, answer_id: 3, text: "Popcorn"})
  const h2f_q4_a4 = await Survey_A.create({survey_id: 2, question_id: 4, answer_id: 4, text: "Oatmeal"})

  const h2f_q5    = await Survey_Q.create({survey_id: 2, question_id: 5, prompt: "The ability to sense other people's emotions is known as:", type: "multiple_choice", point_value: 1})
  const h2f_q5_a1 = await Survey_A.create({survey_id: 2, question_id: 5, answer_id: 1, text: "Empathy", is_correct: true}) // correct
  const h2f_q5_a2 = await Survey_A.create({survey_id: 2, question_id: 5, answer_id: 2, text: "Kinesis"})
  const h2f_q5_a3 = await Survey_A.create({survey_id: 2, question_id: 5, answer_id: 3, text: "Mind Reading"})
  const h2f_q5_a4 = await Survey_A.create({survey_id: 2, question_id: 5, answer_id: 4, text: "Sympathy"})

  const h2f_q6    = await Survey_Q.create({survey_id: 2, question_id: 6, prompt: "The ability to sort through irrelevant information and thoughts to concentrate and focus on a specific task is known as:", type: "multiple_choice", point_value: 1})
  const h2f_q6_a1 = await Survey_A.create({survey_id: 2, question_id: 6, answer_id: 1, text: "Attention"})
  const h2f_q6_a2 = await Survey_A.create({survey_id: 2, question_id: 6, answer_id: 2, text: "Centralizing"})
  const h2f_q6_a3 = await Survey_A.create({survey_id: 2, question_id: 6, answer_id: 3, text: "Processing", is_correct: true}) // correct
  const h2f_q6_a4 = await Survey_A.create({survey_id: 2, question_id: 6, answer_id: 4, text: "Details"})

  const h2f_q7    = await Survey_Q.create({survey_id: 2, question_id: 7, prompt: "The idea of learning how to be fully present and engaged in moment and aware of your thoughts and feelings without distraction or judgment is:", type: "multiple_choice", point_value: 1})
  const h2f_q7_a1 = await Survey_A.create({survey_id: 2, question_id: 7, answer_id: 1, text: "Inner Peace"})
  const h2f_q7_a2 = await Survey_A.create({survey_id: 2, question_id: 7, answer_id: 2, text: "Serenity"})
  const h2f_q7_a3 = await Survey_A.create({survey_id: 2, question_id: 7, answer_id: 3, text: "Empathy"})
  const h2f_q7_a4 = await Survey_A.create({survey_id: 2, question_id: 7, answer_id: 4, text: "Mindfulness", is_correct: true}) // correct

  const h2f_q8    = await Survey_Q.create({survey_id: 2, question_id: 8, prompt: "The process of two people or groups in a conflict agreeing to make amends or come to a truce is known as:", type: "multiple_choice", point_value: 1})
  const h2f_q8_a1 = await Survey_A.create({survey_id: 2, question_id: 8, answer_id: 1, text: "Compatibility"})
  const h2f_q8_a2 = await Survey_A.create({survey_id: 2, question_id: 8, answer_id: 2, text: "Engagement"})
  const h2f_q8_a3 = await Survey_A.create({survey_id: 2, question_id: 8, answer_id: 3, text: "Reconciliation", is_correct: true}) // correct
  const h2f_q8_a4 = await Survey_A.create({survey_id: 2, question_id: 8, answer_id: 4, text: "Empathy"})

  const h2f_q9    = await Survey_Q.create({survey_id: 2, question_id: 9, prompt: "Adults need at least how many hours of sleep per night?", type: "multiple_choice", point_value: 1})
  const h2f_q9_a1 = await Survey_A.create({survey_id: 2, question_id: 9, answer_id: 1, text: "4-5 Hours"})
  const h2f_q9_a2 = await Survey_A.create({survey_id: 2, question_id: 9, answer_id: 2, text: "6-7 Hours"})
  const h2f_q9_a3 = await Survey_A.create({survey_id: 2, question_id: 9, answer_id: 3, text: "7-8 Hours", is_correct: true}) // correct
  const h2f_q9_a4 = await Survey_A.create({survey_id: 2, question_id: 9, answer_id: 4, text: "5-6 Hours"})

  const h2f_q10    = await Survey_Q.create({survey_id: 2, question_id: 10, prompt: "Being awake for more than 20 hours results in an impairment equal to a blood alcohol level of 0.08%.", type: "multiple_choice", point_value: 1})
  const h2f_q10_a1 = await Survey_A.create({survey_id: 2, question_id: 10, answer_id: 1, text: "True", is_correct: true}) // correct
  const h2f_q10_a2 = await Survey_A.create({survey_id: 2, question_id: 10, answer_id: 2, text: "False"})

  const cpa_info = await Survey_Info.create({ author: "brian.harder@army.mil", title: "Cogntive Performance Assessment", description: "The Cognitive Performance Assessment of the Army National Guard is a comprehensive tool designed to holistically evaluate a service member's well-being, encompassing various domains of health and fitness. "})
  
  const cpa_q1    = await Survey_Q.create({survey_id: 3, question_id: 1, header: "Motivation to live a healthy lifestyle in each category", prompt: "M- Physical Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q1_a1 = await Survey_A.create({survey_id: 3, question_id: 1, answer_id: 1, text: "number"})
  const cpa_q2    = await Survey_Q.create({survey_id: 3, question_id: 2, prompt: "M- Mental Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q2_a1 = await Survey_A.create({survey_id: 3, question_id: 2, answer_id: 1, text: "number"})
  const cpa_q3    = await Survey_Q.create({survey_id: 3, question_id: 3, prompt: "M- Nutritional Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q3_a1 = await Survey_A.create({survey_id: 3, question_id: 3, answer_id: 1, text: "number"})
  const cpa_q4    = await Survey_Q.create({survey_id: 3, question_id: 4, prompt: "M- Spiritual Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q4_a1 = await Survey_A.create({survey_id: 3, question_id: 4, answer_id: 1, text: "number"})
  const cpa_q5    = await Survey_Q.create({survey_id: 3, question_id: 5, prompt: "M- Sleep Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q5_a1 = await Survey_A.create({survey_id: 3, question_id: 5, answer_id: 1, text: "number"})

  const cpa_q6     = await Survey_Q.create({survey_id: 3, question_id: 6, header: "Ability to live a healthy lifestyle in each category", prompt: "A- Physical Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q6_a1  = await Survey_A.create({survey_id: 3, question_id: 6, answer_id: 1, text: "number"})
  const cpa_q7     = await Survey_Q.create({survey_id: 3, question_id: 7, prompt: "A- Mental Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q7_a1  = await Survey_A.create({survey_id: 3, question_id: 7, answer_id: 1, text: "number"}) 
  const cpa_q8     = await Survey_Q.create({survey_id: 3, question_id: 8, prompt: "A- Nutritional Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q8_a1  = await Survey_A.create({survey_id: 3, question_id: 8, answer_id: 1, text: "number"})
  const cpa_q9     = await Survey_Q.create({survey_id: 3, question_id: 9, prompt: "A- Spiritual Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q9_a1  = await Survey_A.create({survey_id: 3, question_id: 9, answer_id: 1, text: "number"})
  const cpa_q10    = await Survey_Q.create({survey_id: 3, question_id: 10, prompt: "A- Sleep Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q10_a1 = await Survey_A.create({survey_id: 3, question_id: 10, answer_id: 1, text: "number"})
  
  const cpa_q11    = await Survey_Q.create({survey_id: 3, question_id: 11, header: "Current (past 7 days) in each category", prompt: "C- Physical Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q11_a1 = await Survey_A.create({survey_id: 3, question_id: 11, answer_id: 1, text: "number"})
  const cpa_q12    = await Survey_Q.create({survey_id: 3, question_id: 12, prompt: "C-Mental Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q12_a1 = await Survey_A.create({survey_id: 3, question_id: 12, answer_id: 1, text: "number"})
  const cpa_q13    = await Survey_Q.create({survey_id: 3, question_id: 13, prompt: "C-Nutritional Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q13_a1 = await Survey_A.create({survey_id: 3, question_id: 13, answer_id: 1, text: "number"})
  const cpa_q14    = await Survey_Q.create({survey_id: 3, question_id: 14, prompt: "C-Spiritual Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q14_a1 = await Survey_A.create({survey_id: 3, question_id: 14, answer_id: 1, text: "number"})
  const cpa_q15    = await Survey_Q.create({survey_id: 3, question_id: 15, prompt: "C-Sleep Health: ", type: "number_range", top_range: 10, bottom_range: 1})
  const cpa_q15_a1 = await Survey_A.create({survey_id: 3, question_id: 15, answer_id: 1, text: "number"})

  const fms_info = await Survey_Info.create({survey_id: 4, author: "brian.harder@army.mil", title: "Functional Movement Screening", description: "The Functional Movement Screening (FMS) is an assessment\
   tool used by the Army National Guard to evaluate the fundamental movement patterns of its service members. It is designed to identify functional limitations and asymmetries in the body which can increase\
    the risk of injury. The FMS consists of a series of specific exercises that challenge an individual's ability to perform basic movement patterns without compensation. Each exercise is scored on a scale, and\
     the results provide valuable feedback about an individual's movement quality. The scores can then guide targeted training and corrective exercises, helping to reduce the potential for injury and improve overall\
     physical performance. This systematic approach is vital for ensuring the readiness and resilience of the troops in the ever-demanding physical environments they encounter.", secure: true, password: "1234"})

  const fms_q1    = await Survey_Q.create({survey_id: 4, question_id: 1, prompt: "Grader Name: ", type: "text"})
  const fms_q1_a1 = await Survey_A.create({survey_id: 4, question_id: 1, answer_id: 1, text: "Name"})
  const fms_q2    = await Survey_Q.create({survey_id: 4, question_id: 2, prompt: "Enter Athlete's Score for Deep Squat: ",img: "FMS/DeepSquat.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q2_a1 = await Survey_A.create({survey_id: 4, question_id: 2, answer_id: 1, text: "3"})
  const fms_q3    = await Survey_Q.create({survey_id: 4, question_id: 3, prompt: "Enter Athlete's Score for Hurdle Step: ",img: "FMS/HurdleStep.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q3_a1 = await Survey_A.create({survey_id: 4, question_id: 3, answer_id: 1, text: "3"})
  const fms_q4    = await Survey_Q.create({survey_id: 4, question_id: 4, prompt: "Enter Athlete's Score for Inline Lunge: ",img: "FMS/InlineLunge.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q4_a1 = await Survey_A.create({survey_id: 4, question_id: 4, answer_id: 1, text: "3"})
  const fms_q5    = await Survey_Q.create({survey_id: 4, question_id: 5, prompt: "Enter Athlete's Score for Shoulder Mobility: ",img: "FMS/ShoulderMobility.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q5_a1 = await Survey_A.create({survey_id: 4, question_id: 5, answer_id: 1, text: "3"})
  const fms_q6    = await Survey_Q.create({survey_id: 4, question_id: 6, prompt: "Enter Athlete's Score for Active Straight Leg Raise: ",img: "FMS/ActiveStraightLegRaise.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q6_a1 = await Survey_A.create({survey_id: 4, question_id: 6, answer_id: 1, text: "3"})
  const fms_q7    = await Survey_Q.create({survey_id: 4, question_id: 7, prompt: "Enter Athlete's Score for Trunk Stability Push-Up: ",img: "FMS/TrunkStabilityPushup.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q7_a1 = await Survey_A.create({survey_id: 4, question_id: 7, answer_id: 1, text: "3"})
  const fms_q8    = await Survey_Q.create({survey_id: 4, question_id: 8, prompt: "Enter Athlete's Score for Rotary Stability: ",img: "FMS/RotaryStability.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q8_a1 = await Survey_A.create({survey_id: 4, question_id: 8, answer_id: 1, text: "3"})

  

  /*
  WILL BE USED FOR TESTING PURPOSES

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

*/


  console.log("Data Entered")
}


sequelize.sync({ force: true, alter: true }).then(() => {
  console.log("Database synced")
  setup().then(() => console.log("Setup completed"))
})

module.exports = app;
