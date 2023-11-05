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
const Survey_R = require('./models/Survey/Survey_R')
const Survey_D = require('./models/Survey/Survey_D')
const Survey_V = require('./models/Survey/Survey_V')
const Core_Result = require('./models/Core_Result')
const Notification = require('./models/Notification')

Survey_Info.hasMany(Survey_Q) // foreignKey "survey_id"
Survey_Q.belongsTo(Survey_Info)

Survey_Info.hasMany(Survey_A) // foreignKey "survey_id"
Survey_A.belongsTo(Survey_Info)

User.hasMany(Survey_R)            // foreignKey "user_id"
Survey_R.belongsTo(User)

Survey_Info.hasMany(Survey_D)   // foreignKey "survey_id"
Survey_D.belongsTo(Survey_Info)

Survey_Info.hasMany(Survey_V)   // foreignKey "survey_id"
Survey_V.belongsTo(Survey_Info)

User.hasOne(Core_Result)            // foreignKey "user_id"
Core_Result.belongsTo(User)   // foreignKey "survey_id"

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');
var aboutRouter = require('./routes/about');
var createRouter = require('./routes/create');
var unitsummaryRouter = require('./routes/unitsummary');
var resultsRouter = require('./routes/results');
var uploadRoutes = require('./routes/upload');
var editDeleteRouter = require('./routes/edit-delete');
var notificationRouter = require('./routes/notification');

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
app.use('/results', resultsRouter);
app.use('/edit', editDeleteRouter)
app.use('/notification', notificationRouter)
//excel stuff

app.use('/upload', uploadRoutes);

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
  // Test Admin User
  const adminTest = await User.create({ firstname: "test", lastname: "user", unit: "1st", email: "q", rank: "Cpt", password: '1', gender: 'male', isAdmin: true, state: "WA" })

  // SUBU TEST USERS
  const adminSubu = await User.create({ firstname: "subu", lastname: "kandaswamy", unit: "1st", email: "kandaswamy", rank: "Cpt", password: '1234', gender: 'male', isAdmin: true, state: "VA" })
  const subu1 = await User.create({ firstname: "subu", lastname: "kandaswamy", unit: "1st", email: "subu1", rank: "Sgt", gender: 'male', state: "VA" })
  const subu2 = await User.create({ firstname: "subu", lastname: "kandaswamy", unit: "1st", email: "subu2", rank: "Sgt", gender: 'male', state: "VA" })
  
  const user = await User.create({ firstname: "John", lastname: "Doe", unit: "1st", email: "user", rank: "Sgt", state: "VA" })
  const user1 = await User.create({ firstname: "Jack", lastname: "Dawson", unit: "1st", email: "user1", rank: "Sgt", state: "VA" })
  const unitleader = await User.create({ firstname: "Jane", lastname: "Doe", unit: "1st", email: "jane.doe@army.mil", rank: "SSgt", password: '1234', isUnitLeader: true, state: "VA" })
  const admin = await User.create({ firstname: "Brian", lastname: "Harder", unit: "1st", email: "brian.harder@army.mil", rank: "Cpt", password: '1234', isAdmin: true, state: "VA" })
  // Users for the 1st unit
  const user2 = await User.create({ firstname: "Jill", lastname: "Shawn", unit: "1st", email: "jill.shawn@army.mil", rank: "Pvt", state: "VA" });
  const user3 = await User.create({ firstname: "Joe", lastname: "Johnson", unit: "1st", email: "joe.johnson@army.mil", rank: "Sgt", state: "VA" });
  const user4 = await User.create({ firstname: "Adam", lastname: "Smith", unit: "1st", email: "adam.smith@army.mil", rank: "Cpl", state: "VA" });
  const user5 = await User.create({ firstname: "John", lastname: "Don", unit: "1st", email: "john.don@army.mil", rank: "Pvt", state: "VA" });
  const user6 = await User.create({ firstname: "Jane", lastname: "Jackson", unit: "1st", email: "jane.jackson@army.mil", rank: "Sgt", state: "VA" });
  const user7 = await User.create({ firstname: "Mike", lastname: "Smith", unit: "1st", email: "mike.smith@army.mil", rank: "Pvt", state: "VA" });
  const user8 = await User.create({ firstname: "Emily", lastname: "Jones", unit: "1st", email: "emily.jones@army.mil", rank: "Pvt", state: "VA" });
  const user9 = await User.create({ firstname: "David", lastname: "Brown", unit: "1st", email: "david.brown@army.mil", rank: "Sgt", state: "VA" });

  // Users for the 2nd unit
  const user10 = await User.create({ firstname: "Amy", lastname: "Wilson", unit: "2nd", email: "amy.wilson@army.mil", rank: "Pvt", state: "NC" });
  const user11 = await User.create({ firstname: "Mark", lastname: "Taylor", unit: "2nd", email: "mark.taylor@army.mil", rank: "Pvt", state: "NC" });
  const user12 = await User.create({ firstname: "Karen", lastname: "Anderson", unit: "2nd", email: "karen.anderson@army.mil", rank: "Sgt", state: "NC" });
  const user13 = await User.create({ firstname: "Chris", lastname: "Lee", unit: "2nd", email: "chris.lee@army.mil", rank: "Pvt", state: "NC" });
  const user14 = await User.create({ firstname: "Lisa", lastname: "Kim", unit: "2nd", email: "lisa.kim@army.mil", rank: "Pvt", state: "NC" });
  const user15 = await User.create({ firstname: "Brian", lastname: "Chen", unit: "2nd", email: "brian.chen@army.mil", rank: "Sgt", state: "NC" });
  const user16 = await User.create({ firstname: "Jessica", lastname: "Wang", unit: "2nd", email: "jessica.wang@army.mil", rank: "Pvt", state: "NC" });
  const user17 = await User.create({ firstname: "Kevin", lastname: "Zhang", unit: "2nd", email: "kevin.zhang@army.mil", rank: "Pvt", state: "NC" });
  const user18 = await User.create({ firstname: "Michelle", lastname: "Li", unit: "2nd", email: "michelle.li@army.mil", rank: "Sgt", state: "NC" });

  // Users for the 3rd unit
  const user19 = await User.create({ firstname: "Andrew", lastname: "Wu", unit: "3rd", email: "andrew.wu@army.mil", rank: "Pvt", state: "PA" });
  const user20 = await User.create({ firstname: "Stephanie", lastname: "Chang", unit: "3rd", email: "stephanie.chang@army.mil", rank: "Pvt", state: "PA" });
  const user21 = await User.create({ firstname: "Jason", lastname: "Chen", unit: "3rd", email: "jason.chen@army.mil", rank: "Sgt", state: "PA" });
  const user22 = await User.create({ firstname: "Rachel", lastname: "Liu", unit: "3rd", email: "rachel.liu@army.mil", rank: "Pvt", state: "PA" });
  const user23 = await User.create({ firstname: "Eric", lastname: "Wang", unit: "3rd", email: "eric.wang@army.mil", rank: "Pvt", state: "PA" });
  const user24 = await User.create({ firstname: "Catherine", lastname: "Zhang", unit: "3rd", email: "catherine.zhang@army.mil", rank: "Sgt", state: "PA" });
  const user25 = await User.create({ firstname: "Justin", lastname: "Chen", unit: "3rd", email: "justin.chen@army.mil", rank: "Pvt", state: "PA" });
  const user26 = await User.create({ firstname: "Grace", lastname: "Wu", unit: "3rd", email: "grace.wu@army.mil", rank: "Pvt", state: "PA" });
  const user27 = await User.create({ firstname: "Steven", lastname: "Liu", unit: "3rd", email: "steven.liu@army.mil", rank: "Sgt", state: "PA" });



  const h2f_info = await Survey_Info.create({author: "brian.harder@army.mil", title: "Holistic Health Assessment", description: "H2F is designed to optimize Soldier personal readiness,\
  reduce injury rates, improve rehabilitation after injury, and increase the overall effectiveness of the Total Army. These assessment tools are designed to help you identify your strengths\
   and weaknesses in the areas of Holistic Health and Fitness and must be completed by all members of the Army National Guard along with the PHA.", isCore: true, version: 1,  card_img: "/images/default_imgs/img3.png"})

  const h2f_q1    = await Survey_Q.create({survey_id: 1, question_id: 1, prompt: "How long should you cool down after a workout?", type: "multiple_choice", core_category: "Physical"})
  const h2f_q1_a1 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 1, text: "30 minutes"})
  const h2f_q1_a2 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 2, text: "75 minutes"})
  const h2f_q1_a3 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 3, text: "300 minutes"})
  const h2f_q1_a4 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 4, text: "150 minutes", is_correct: true}) // correct

  const h2f_q2    = await Survey_Q.create({survey_id: 1, question_id: 2, prompt: "All of the following can be results of doing a proper cool down after exercise EXCEPT:", type: "multiple_choice", core_category: "Physical"})
  const h2f_q2_a1 = await Survey_A.create({survey_id: 1, question_id: 2, answer_id: 1, text: "Slowly reducing heart rate"})
  const h2f_q2_a2 = await Survey_A.create({survey_id: 1, question_id: 2, answer_id: 2, text: "Preventing blood pooling in the extremities"})
  const h2f_q2_a3 = await Survey_A.create({survey_id: 1, question_id: 2, answer_id: 3, text: "Increase the body's ability to burn fat", is_correct: true}) // correct
  const h2f_q2_a4 = await Survey_A.create({survey_id: 1, question_id: 2, answer_id: 4, text: "Enhancing Flexibility and range of motion"})

  const h2f_q3    = await Survey_Q.create({survey_id: 1, question_id: 3, prompt: "Which of the following is not a food group:", type: "multiple_choice", core_category: "Nutrition"})
  const h2f_q3_a1 = await Survey_A.create({survey_id: 1, question_id: 3, answer_id: 1, text: "Fruits"})
  const h2f_q3_a2 = await Survey_A.create({survey_id: 1, question_id: 3, answer_id: 2, text: "Rice", is_correct: true}) // correct
  const h2f_q3_a3 = await Survey_A.create({survey_id: 1, question_id: 3, answer_id: 3, text: "Grains"})
  const h2f_q3_a4 = await Survey_A.create({survey_id: 1, question_id: 3, answer_id: 4, text: "Protein"})

  const h2f_q4    = await Survey_Q.create({survey_id: 1, question_id: 4, prompt: "All of the following are examples of whole grains except:", type: "multiple_choice", core_category: "Nutrition"})
  const h2f_q4_a1 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 1, text: "Brown Rice"})
  const h2f_q4_a2 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 2, text: "White Bread", is_correct: true}) // correct
  const h2f_q4_a3 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 3, text: "Popcorn"})
  const h2f_q4_a4 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 4, text: "Oatmeal"})

  const h2f_q5    = await Survey_Q.create({survey_id: 1, question_id: 5, prompt: "The ability to sense other people's emotions is known as:", type: "multiple_choice", core_category: "Mental"})
  const h2f_q5_a1 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 1, text: "Empathy", is_correct: true}) // correct
  const h2f_q5_a2 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 2, text: "Kinesis"})
  const h2f_q5_a3 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 3, text: "Mind Reading"})
  const h2f_q5_a4 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 4, text: "Sympathy"})

  const h2f_q6    = await Survey_Q.create({survey_id: 1, question_id: 6, prompt: "The ability to sort through irrelevant information and thoughts to concentrate and focus on a specific task is known as:", type: "multiple_choice", core_category: "Mental"})
  const h2f_q6_a1 = await Survey_A.create({survey_id: 1, question_id: 6, answer_id: 1, text: "Attention"})
  const h2f_q6_a2 = await Survey_A.create({survey_id: 1, question_id: 6, answer_id: 2, text: "Centralizing"})
  const h2f_q6_a3 = await Survey_A.create({survey_id: 1, question_id: 6, answer_id: 3, text: "Processing", is_correct: true}) // correct
  const h2f_q6_a4 = await Survey_A.create({survey_id: 1, question_id: 6, answer_id: 4, text: "Details"})

  const h2f_q7    = await Survey_Q.create({survey_id: 1, question_id: 7, prompt: "The idea of learning how to be fully present and engaged in moment and aware of your thoughts and feelings without distraction or judgment is:", type: "multiple_choice", core_category: "Spiritual"})
  const h2f_q7_a1 = await Survey_A.create({survey_id: 1, question_id: 7, answer_id: 1, text: "Inner Peace"})
  const h2f_q7_a2 = await Survey_A.create({survey_id: 1, question_id: 7, answer_id: 2, text: "Serenity"})
  const h2f_q7_a3 = await Survey_A.create({survey_id: 1, question_id: 7, answer_id: 3, text: "Empathy"})
  const h2f_q7_a4 = await Survey_A.create({survey_id: 1, question_id: 7, answer_id: 4, text: "Mindfulness", is_correct: true}) // correct

  const h2f_q8    = await Survey_Q.create({survey_id: 1, question_id: 8, prompt: "The process of two people or groups in a conflict agreeing to make amends or come to a truce is known as:", type: "multiple_choice", core_category: "Spiritual"})
  const h2f_q8_a1 = await Survey_A.create({survey_id: 1, question_id: 8, answer_id: 1, text: "Compatibility"})
  const h2f_q8_a2 = await Survey_A.create({survey_id: 1, question_id: 8, answer_id: 2, text: "Engagement"})
  const h2f_q8_a3 = await Survey_A.create({survey_id: 1, question_id: 8, answer_id: 3, text: "Reconciliation", is_correct: true}) // correct
  const h2f_q8_a4 = await Survey_A.create({survey_id: 1, question_id: 8, answer_id: 4, text: "Empathy"})

  const h2f_q9    = await Survey_Q.create({survey_id: 1, question_id: 9, prompt: "Adults need at least how many hours of sleep per night?", type: "multiple_choice", core_category: "Sleep"})
  const h2f_q9_a1 = await Survey_A.create({survey_id: 1, question_id: 9, answer_id: 1, text: "4-5 Hours"})
  const h2f_q9_a2 = await Survey_A.create({survey_id: 1, question_id: 9, answer_id: 2, text: "6-7 Hours"})
  const h2f_q9_a3 = await Survey_A.create({survey_id: 1, question_id: 9, answer_id: 3, text: "7-8 Hours", is_correct: true}) // correct
  const h2f_q9_a4 = await Survey_A.create({survey_id: 1, question_id: 9, answer_id: 4, text: "5-6 Hours"})

  const h2f_q10    = await Survey_Q.create({survey_id: 1, question_id: 10, prompt: "Being awake for more than 20 hours results in an impairment equal to a blood alcohol level of 0.08%.", type: "multiple_choice", core_category: "Sleep"})
  const h2f_q10_a1 = await Survey_A.create({survey_id: 1, question_id: 10, answer_id: 1, text: "True", is_correct: true}) // correct
  const h2f_q10_a2 = await Survey_A.create({survey_id: 1, question_id: 10, answer_id: 2, text: "False"})


  const cpa_info = await Survey_Info.create({ author: "brian.harder@army.mil", title: "Cogntive Performance Assessment", description: "The Cognitive Performance Assessment of the Army National Guard is a comprehensive tool designed to holistically evaluate a service member's well-being, encompassing various domains of health and fitness. ", 
  isCore: true, card_img: "/images/default_imgs/img1.png", version: 1})
  
  const cpa_q1    = await Survey_Q.create({survey_id: 2, question_id: 1, header: "Motivation to live a healthy lifestyle in each category", prompt: "Physical Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Motivation"})
  const cpa_q1_a1 = await Survey_A.create({survey_id: 2, question_id: 1, answer_id: 1, text: "number"})
  const cpa_q2    = await Survey_Q.create({survey_id: 2, question_id: 2, prompt: "Mental Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Motivation"})
  const cpa_q2_a1 = await Survey_A.create({survey_id: 2, question_id: 2, answer_id: 1, text: "number"})
  const cpa_q3    = await Survey_Q.create({survey_id: 2, question_id: 3, prompt: "Nutritional Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Motivation"})
  const cpa_q3_a1 = await Survey_A.create({survey_id: 2, question_id: 3, answer_id: 1, text: "number"})
  const cpa_q4    = await Survey_Q.create({survey_id: 2, question_id: 4, prompt: "Spiritual Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Motivation"})
  const cpa_q4_a1 = await Survey_A.create({survey_id: 2, question_id: 4, answer_id: 1, text: "number"})
  const cpa_q5    = await Survey_Q.create({survey_id: 2, question_id: 5, prompt: "Sleep Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Motivation"})
  const cpa_q5_a1 = await Survey_A.create({survey_id: 2, question_id: 5, answer_id: 1, text: "number"})

  const cpa_q6     = await Survey_Q.create({survey_id: 2, question_id: 6, header: "Ability to live a healthy lifestyle in each category", prompt: "Physical Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Ability"})
  const cpa_q6_a1  = await Survey_A.create({survey_id: 2, question_id: 6, answer_id: 1, text: "number"})
  const cpa_q7     = await Survey_Q.create({survey_id: 2, question_id: 7, prompt: "Mental Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Ability"})
  const cpa_q7_a1  = await Survey_A.create({survey_id: 2, question_id: 7, answer_id: 1, text: "number"}) 
  const cpa_q8     = await Survey_Q.create({survey_id: 2, question_id: 8, prompt: "Nutritional Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Ability"})
  const cpa_q8_a1  = await Survey_A.create({survey_id: 2, question_id: 8, answer_id: 1, text: "number"})
  const cpa_q9     = await Survey_Q.create({survey_id: 2, question_id: 9, prompt: "Spiritual Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Ability"})
  const cpa_q9_a1  = await Survey_A.create({survey_id: 2, question_id: 9, answer_id: 1, text: "number"})
  const cpa_q10    = await Survey_Q.create({survey_id: 2, question_id: 10, prompt: "Sleep Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Ability"})
  const cpa_q10_a1 = await Survey_A.create({survey_id: 2, question_id: 10, answer_id: 1, text: "number"})
  
  const cpa_q11    = await Survey_Q.create({survey_id: 2, question_id: 11, header: "Current (past 7 days) in each category", prompt: "Physical Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Current"})
  const cpa_q11_a1 = await Survey_A.create({survey_id: 2, question_id: 11, answer_id: 1, text: "number"})
  const cpa_q12    = await Survey_Q.create({survey_id: 2, question_id: 12, prompt: "Mental Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Current"})
  const cpa_q12_a1 = await Survey_A.create({survey_id: 2, question_id: 12, answer_id: 1, text: "number"})
  const cpa_q13    = await Survey_Q.create({survey_id: 2, question_id: 13, prompt: "Nutritional Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Current"})
  const cpa_q13_a1 = await Survey_A.create({survey_id: 2, question_id: 13, answer_id: 1, text: "number"})
  const cpa_q14    = await Survey_Q.create({survey_id: 2, question_id: 14, prompt: "Spiritual Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Current"})
  const cpa_q14_a1 = await Survey_A.create({survey_id: 2, question_id: 14, answer_id: 1, text: "number"})
  const cpa_q15    = await Survey_Q.create({survey_id: 2, question_id: 15, prompt: "Sleep Health: ", type: "number_range", top_range: 10, bottom_range: 1, core_category: "Current"})
  const cpa_q15_a1 = await Survey_A.create({survey_id: 2, question_id: 15, answer_id: 1, text: "number"})

  const fms_info = await Survey_Info.create({survey_id: 3, author: "brian.harder@army.mil", title: "Movement Screening Assessment", description: "The  Movement Screening is an assessment\
   tool used by the Army National Guard to evaluate the fundamental movement patterns of its service members. It is designed to identify functional limitations and asymmetries in the body which can increase\
    the risk of injury. The FMS consists of a series of specific exercises that challenge an individual's ability to perform basic movement patterns without compensation. Each exercise is scored on a scale, and\
     the results provide valuable feedback about an individual's movement quality. The scores can then guide targeted training and corrective exercises, helping to reduce the potential for injury and improve overall\
     physical performance. This systematic approach is vital for ensuring the readiness and resilience of the troops in the ever-demanding physical environments they encounter.", secure: true, password: "1234", isCore: true, version: 1, card_img: "/images/default_imgs/img2.png"})

  const fms_q1    = await Survey_Q.create({survey_id: 3, question_id: 1, prompt: "Grader Name: ", type: "text"})
  const fms_q1_a1 = await Survey_A.create({survey_id: 3, question_id: 1, answer_id: 1, text: "Name"})
  const fms_q2    = await Survey_Q.create({survey_id: 3, question_id: 2, prompt: "Enter Athlete's Score for Deep Squat: ",img: "FMS/DeepSquat.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q2_a1 = await Survey_A.create({survey_id: 3, question_id: 2, answer_id: 1, text: "3"})
  const fms_q3    = await Survey_Q.create({survey_id: 3, question_id: 3, prompt: "Enter Athlete's Score for Hurdle Step: ",img: "FMS/HurdleStep.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q3_a1 = await Survey_A.create({survey_id: 3, question_id: 3, answer_id: 1, text: "3"})
  const fms_q4    = await Survey_Q.create({survey_id: 3, question_id: 4, prompt: "Enter Athlete's Score for Inline Lunge: ",img: "FMS/InlineLunge.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q4_a1 = await Survey_A.create({survey_id: 3, question_id: 4, answer_id: 1, text: "3"})
  const fms_q5    = await Survey_Q.create({survey_id: 3, question_id: 5, prompt: "Enter Athlete's Score for Shoulder Mobility: ",img: "FMS/ShoulderMobility.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q5_a1 = await Survey_A.create({survey_id: 3, question_id: 5, answer_id: 1, text: "3"})
  const fms_q6    = await Survey_Q.create({survey_id: 3, question_id: 6, prompt: "Enter Athlete's Score for Active Straight Leg Raise: ",img: "FMS/ActiveStraightLegRaise.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q6_a1 = await Survey_A.create({survey_id: 3, question_id: 6, answer_id: 1, text: "3"})
  const fms_q7    = await Survey_Q.create({survey_id: 3, question_id: 7, prompt: "Enter Athlete's Score for Trunk Stability Push-Up: ",img: "FMS/TrunkStabilityPushup.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q7_a1 = await Survey_A.create({survey_id: 3, question_id: 7, answer_id: 1, text: "3"})
  const fms_q8    = await Survey_Q.create({survey_id: 3, question_id: 8, prompt: "Enter Athlete's Score for Rotary Stability: ",img: "FMS/RotaryStability.png", type: "number_range", bottom_range: 0, top_range: 3})
  const fms_q8_a1 = await Survey_A.create({survey_id: 3, question_id: 8, answer_id: 1, text: "3"})

  const survey_one       = await Survey_Info.create({ author: "brian.harder@army.mil", title: "Survey One", description: "This is a test survey", version: 1})
  const survey_one_q2    = await Survey_Q.create({survey_id: 4, question_id: 1, prompt: "What is the capital of Washington State?", type: "multiple_choice"})
  const survey_one_q2_a1 = await Survey_A.create({survey_id: 4, question_id: 1, answer_id: 1, text: "Seattle"})
  const survey_one_q2_a2 = await Survey_A.create({survey_id: 4, question_id: 1, answer_id: 2, text: "Pullman"})
  const survey_one_q2_a3 = await Survey_A.create({survey_id: 4, question_id: 1, answer_id: 3, text: "Olympia"})
  const survey_one_q2_a4 = await Survey_A.create({survey_id: 4, question_id: 1, answer_id: 4, text: "Vancouver"})
  const survey_one_q3    = await Survey_Q.create({survey_id: 4, question_id: 2, prompt: "Enter you name please?", type: "text"})
  const survey_one_q3_a1 = await Survey_A.create({survey_id: 4, question_id: 2, answer_id: 1, text: "Name"})
  const survey_one_q4    = await Survey_Q.create({survey_id: 4, question_id: 3, prompt: "What is your favorite number from 5-10?", type: "number_range", top_range: 10, bottom_range: 5})
  const survey_one_q4_a1 = await Survey_A.create({survey_id: 4, question_id: 3, answer_id: 1, text: "number"})
  const survey_one_q5    = await Survey_Q.create({survey_id: 4, question_id: 4, prompt: "Select all the classes that you have taken:", type: "checkbox"})
  const survey_one_q5_a1 = await Survey_A.create({survey_id: 4, question_id: 4, answer_id: 1, text: "CPT_S 302"})
  const survey_one_q5_a2 = await Survey_A.create({survey_id: 4, question_id: 4, answer_id: 2, text: "CPT_S 350"})
  const survey_one_q5_a3 = await Survey_A.create({survey_id: 4, question_id: 4, answer_id: 3, text: "CPT_S 360"})
  const survey_one_q5_a4 = await Survey_A.create({survey_id: 4, question_id: 4, answer_id: 4, text: "CPT_S 421"})
  const survey_one_q6    = await Survey_Q.create({survey_id: 4, question_id: 5, prompt: "Can you see the following image",img: "FMS/DeepSquat.png", type: "multiple_choice"})
  const survey_one_q6_a1 = await Survey_A.create({survey_id: 4, question_id: 5, answer_id: 1, text: "Yes"})
  const survey_one_q6_a2 = await Survey_A.create({survey_id: 4, question_id: 5, answer_id: 2, text: "No"})

  const res1  = await Survey_R.create({survey_id: 4, version: 1, email: "user", results: {"1": "Seattle", "2": "de", "3": "10", "4": ["CPT_S 302", "CPT_S 350"], "5": "Yes"}, timestamp: "2023-01-12T08:20:30.000Z"})
  const res2  = await Survey_R.create({survey_id: 4, version: 1, email: "jill.shawn@army.mil", results: {"1": "Pullman", "2": "Jill Shawn", "3": "7", "4": ["CPT_S 350", "CPT_S 360"], "5": "No"}, timestamp: "2023-01-12T10:15:45.000Z"})
  const res3  = await Survey_R.create({survey_id: 4, version: 1, email: "joe.johnson@army.mil", results: {"1": "Olympia", "2": "Joe Johnson", "3": "5", "4": ["CPT_S 302", "CPT_S 360"], "5": "No"}, timestamp: "2023-02-18T13:00:00.000Z"})
  const res4  = await Survey_R.create({survey_id: 4, version: 1, email: "adam.smith@army.mil", results: {"1": "Vancouver", "2": "Adam Smith", "3": "8", "4": ["CPT_S 302"], "5": "No"}, timestamp: "2023-03-22T18:30:00.000Z"})
  const res5  = await Survey_R.create({survey_id: 4, version: 1, email: "john.don@army.mil", results: {"1": "Pullman", "2": "John Don", "3": "6", "4": ["CPT_S 350", "CPT_S 421"], "5": "Yes"}, timestamp: "2023-03-22T20:45:00.000Z"})
  const res6  = await Survey_R.create({survey_id: 4, version: 1, email: "jane.jackson@army.mil", results: {"1": "Seattle", "2": "Jane Jackson", "3": "4", "4": ["CPT_S 302", "CPT_S 350", "CPT_S 421"], "5": "No"}, timestamp: "2023-04-15T07:15:15.000Z"})
  const res7  = await Survey_R.create({survey_id: 4, version: 1, email: "mike.smith@army.mil", results: {"1": "Olympia", "2": "Mike Smith", "3": "2", "4": ["CPT_S 302", "CPT_S 350", "CPT_S 360", "CPT_S 421"], "5": "No"}, timestamp: "2023-05-19T06:22:11.000Z"})
  const res8  = await Survey_R.create({survey_id: 4, version: 1, email: "emily.jones@army.mil", results: {"1": "Seattle", "2": "Emily Jones", "3": "9", "4": ["CPT_S 302", "CPT_S 360"], "5": "No"}, timestamp: "2023-06-30T16:45:25.000Z"})
  const res9  = await Survey_R.create({survey_id: 4, version: 1, email: "david.brown@army.mil", results: {"1": "Olympia", "2": "David Brown", "3": "1", "4": ["CPT_S 302", "CPT_S 350"], "5": "No"}, timestamp: "2023-06-30T19:05:35.000Z"})
  const res10 = await Survey_R.create({survey_id: 4, version: 1, email: "amy.wilson@army.mil", results: {"1": "Pullman", "2": "Amy Wilson", "3": "6", "4": ["CPT_S 302", "CPT_S 421"], "5": "No"}, timestamp: "2023-07-04T00:00:00.000Z"})
  const res11 = await Survey_R.create({survey_id: 4, version: 1, email: "mark.taylor@army.mil", results: {"1": "Olympia", "2": "Mark Taylor", "3": "5", "4": ["CPT_S 302", "CPT_S 350", "CPT_S 421"], "5": "No"}, timestamp: "2023-08-24T23:59:59.000Z"})
  const res12 = await Survey_R.create({survey_id: 4, version: 1, email: "karen.anderson@army.mil", results: {"1": "Olympia", "2": "Karen Anderson", "3": "7", "4": ["CPT_S 350"], "5": "Yes"}, timestamp: "2023-10-13T05:05:05.000Z"})
  const res13 = await Survey_R.create({survey_id: 4, version: 1, email: "chris.lee@army.mil", results: {"1": "Olympia", "2": "Chris Lee", "3": "4", "4": ["CPT_S 302", "CPT_S 360"], "5": "Yes"}, timestamp: "2023-11-02T00:14:38.000Z"})
  const res14 = await Survey_R.create({survey_id: 4, version: 1, email: "lisa.kim@army.mil", results: {"1": "Olympia", "2": "Lisa Kim", "3": "9", "4": ["CPT_S 360", "CPT_S 421"], "5": "Yes"}, timestamp: "2023-12-25T18:00:00.000Z"})
  const res15 = await Survey_R.create({survey_id: 4, version: 1, email: "brian.chen@army.mil", results: {"1": "Olympia", "2": "Brian Chen", "3": "8", "4": ["CPT_S 350", "CPT_S 360"], "5": "No"}, timestamp: "2024-01-01T00:00:00.000Z"})
  const res16 = await Survey_R.create({survey_id: 4, version: 1, email: "jessica.wang@army.mil", results: {"1": "Olympia", "2": "Jessica Wang", "3": "6", "4": ["CPT_S 302", "CPT_S 421"], "5": "No"}, timestamp: "2024-03-01T09:30:30.000Z"})
  const res17 = await Survey_R.create({survey_id: 4, version: 1, email: "kevin.zhang@army.mil", results: {"1": "Olympia", "2": "Kevin Zhang", "3": "2", "4": ["CPT_S 350", "CPT_S 421"], "5": "No"}, timestamp: "2024-05-16T15:45:15.000Z"})
  const res18 = await Survey_R.create({survey_id: 4, version: 1, email: "michelle.li@army.mil", results: {"1": "Olympia", "2": "Michelle Li", "3": "5", "4": ["CPT_S 302", "CPT_S 360"], "5": "No"}, timestamp: "2024-05-16T17:20:20.000Z"})
  const res19 = await Survey_R.create({survey_id: 4, version: 1, email: "andrew.wu@army.mil", results: {"1": "Vancouver", "2": "Andrew Wu", "3": "7", "4": ["CPT_S 350", "CPT_S 360", "CPT_S 421"], "5": "No"}, timestamp: "2024-07-20T08:20:20.000Z"})
  const res20 = await Survey_R.create({survey_id: 4, version: 1, email: "stephanie.chang@army.mil", results: {"1": "Pullman", "2": "Stephanie Chang", "3": "3", "4": ["CPT_S 421"], "5": "No"}, timestamp: "2024-08-15T12:12:12.000Z"})
  const res21 = await Survey_R.create({survey_id: 4, version: 1, email: "jason.chen@army.mil", results: {"1": "Olympia", "2": "Jason Chen", "3": "4", "4": ["CPT_S 350", "CPT_S 421"], "5": "No"}, timestamp: "2024-09-10T14:40:40.000Z"})
  const res22 = await Survey_R.create({survey_id: 4, version: 1, email: "rachel.liu@army.mil", results: {"1": "Olympia", "2": "Rachel Liu", "3": "9", "4": ["CPT_S 302", "CPT_S 350", "CPT_S 360", "CPT_S 421"], "5": "Yes"}, timestamp: "2024-10-30T11:11:11.000Z"})
  const res23 = await Survey_R.create({survey_id: 4, version: 1, email: "eric.wang@army.mil", results: {"1": "Vancouver", "2": "Eric Wang", "3": "1", "4": ["CPT_S 360", "CPT_S 421"], "5": "Yes"}, timestamp: "2024-10-30T13:13:13.000Z"})
  const res24 = await Survey_R.create({survey_id: 4, version: 1, email: "catherine.zhang@army.mil", results: {"1": "Olympia", "2": "Catherine Zhang", "3": "8", "4": ["CPT_S 302", "CPT_S 360", "CPT_S 421"], "5": "No"}, timestamp: "2024-11-02T00:14:38.000Z"})
  const res25 = await Survey_R.create({survey_id: 4, version: 1, email: "justin.chen@army.mil", results: {"1": "Vancouver", "2": "Justin Chen", "3": "2", "4": ["CPT_S 302", "CPT_S 350"], "5": "Yes"}, timestamp: "2024-12-31T23:59:59.000Z"})
  const res26 = await Survey_R.create({survey_id: 4, version: 1, email: "grace.wu@army.mil", results: {"1": "Olympia", "2": "Grace Wu", "3": "7", "4": ["CPT_S 360", "CPT_S 421"], "5": "No"}, timestamp: "2024-12-31T23:59:59.000Z"})
  const res27 = await Survey_R.create({survey_id: 4, version: 1, email: "steven.liu@army.mil", results: {"1": "Seattle", "2": "Steven Liu", "3": "6", "4": ["CPT_S 302", "CPT_S 360"], "5": "Yes"}, timestamp: "2024-12-31T23:59:59.000Z"})





  const h2f_res1  = await Survey_R.create({survey_id: 1, version: 1, email: "user", results: {"1": "150 minutes", "2": "Slowly reducing heart rate", "3": "Rice", "4": "White Bread", "5": "Empathy", "6": "Attention", "7": "Mindfulness", "8": "Reconciliation", "9": "7-8 Hours", "10": "True"}, timestamp: "2023-01-12T08:20:30.000Z"})
  const h2f_res2  = await Survey_R.create({survey_id: 1, version: 1, email: "jill.shawn@army.mil", results: {"1": "30 minutes", "2": "Preventing blood pooling in the extremities", "3": "Fruits", "4": "Brown Rice", "5": "Sympathy", "6": "Centralizing", "7": "Inner Peace", "8": "Engagement", "9": "6-7 Hours", "10": "False"}, timestamp: "2023-01-12T10:15:45.000Z"})
  const h2f_res3  = await Survey_R.create({survey_id: 1, version: 1, email: "joe.johnson@army.mil", results: {"1": "75 minutes", "2": "Enhancing Flexibility and range of motion", "3": "Grains", "4": "Popcorn", "5": "Mind Reading", "6": "Details", "7": "Serenity", "8": "Compatibility", "9": "5-6 Hours", "10": "True"}, timestamp: "2023-02-18T13:00:00.000Z"})
  const h2f_res4  = await Survey_R.create({survey_id: 1, version: 1, email: "adam.smith@army.mil", results: {"1": "30 minutes", "2": "Enhancing Flexibility and range of motion", "3": "Fruits", "4": "Oatmeal", "5": "Kinesis", "6": "Processing", "7": "Inner Peace", "8": "Compatibility", "9": "4-5 Hours", "10": "False"}, timestamp: "2023-03-22T18:30:00.000Z"})
  const h2f_res5  = await Survey_R.create({survey_id: 1, version: 1, email: "john.don@army.mil", results: {"1": "150 minutes", "2": "Slowly reducing heart rate", "3": "Protein", "4": "Brown Rice", "5": "Empathy", "6": "Attention", "7": "Serenity", "8": "Reconciliation", "9": "7-8 Hours", "10": "True"}, timestamp: "2023-03-22T20:45:00.000Z"})
  const h2f_res6  = await Survey_R.create({survey_id: 1, version: 1, email: "jane.jackson@army.mil", results: {"1": "75 minutes", "2": "Preventing blood pooling in the extremities", "3": "Grains", "4": "Popcorn", "5": "Sympathy", "6": "Details", "7": "Mindfulness", "8": "Engagement", "9": "5-6 Hours", "10": "False"}, timestamp: "2023-04-15T07:15:15.000Z"})
  const h2f_res7  = await Survey_R.create({survey_id: 1, version: 1, email: "mike.smith@army.mil", results: {"1": "300 minutes", "2": "Increase the body's ability to burn fat", "3": "Rice", "4": "White Bread", "5": "Mind Reading", "6": "Centralizing", "7": "Inner Peace", "8": "Compatibility", "9": "6-7 Hours", "10": "True"}, timestamp: "2023-05-19T06:22:11.000Z"})
  const h2f_res8  = await Survey_R.create({survey_id: 1, version: 1, email: "emily.jones@army.mil", results: {"1": "150 minutes", "2": "Enhancing Flexibility and range of motion", "3": "Fruits", "4": "Brown Rice", "5": "Empathy", "6": "Processing", "7": "Serenity", "8": "Reconciliation", "9": "7-8 Hours", "10": "False"}, timestamp: "2023-06-30T16:45:25.000Z"})
  const h2f_res9  = await Survey_R.create({survey_id: 1, version: 1, email: "david.brown@army.mil", results: {"1": "30 minutes", "2": "Slowly reducing heart rate", "3": "Protein", "4": "Popcorn", "5": "Kinesis", "6": "Attention", "7": "Mindfulness", "8": "Engagement", "9": "4-5 Hours", "10": "True"}, timestamp: "2023-06-30T19:05:35.000Z"})
  const h2f_res10 = await Survey_R.create({survey_id: 1, version: 1, email: "amy.wilson@army.mil", results: {"1": "75 minutes", "2": "Preventing blood pooling in the extremities", "3": "Grains", "4": "Oatmeal", "5": "Sympathy", "6": "Details", "7": "Inner Peace", "8": "Compatibility", "9": "5-6 Hours", "10": "False"}, timestamp: "2023-07-04T00:00:00.000Z"})
  const h2f_res11 = await Survey_R.create({survey_id: 1, version: 1, email: "mark.taylor@army.mil", results: {"1": "300 minutes", "2": "Increase the body's ability to burn fat", "3": "Rice", "4": "White Bread", "5": "Mind Reading", "6": "Centralizing", "7": "Serenity", "8": "Reconciliation", "9": "6-7 Hours", "10": "True"}, timestamp: "2023-08-24T23:59:59.000Z"})
  const h2f_res12 = await Survey_R.create({survey_id: 1, version: 1, email: "karen.anderson@army.mil", results: {"1": "150 minutes", "2": "Enhancing Flexibility and range of motion", "3": "Fruits", "4": "Brown Rice", "5": "Empathy", "6": "Processing", "7": "Mindfulness", "8": "Engagement", "9": "7-8 Hours", "10": "False"}, timestamp: "2023-10-13T05:05:05.000Z"})
  const h2f_res13 = await Survey_R.create({survey_id: 1, version: 1, email: "chris.lee@army.mil", results: {"1": "30 minutes", "2": "Slowly reducing heart rate", "3": "Protein", "4": "Popcorn", "5": "Kinesis", "6": "Attention", "7": "Inner Peace", "8": "Compatibility", "9": "4-5 Hours", "10": "True"}, timestamp: "2023-11-02T00:14:38.000Z"})
  const h2f_res14 = await Survey_R.create({survey_id: 1, version: 1, email: "lisa.kim@army.mil", results: {"1": "75 minutes", "2": "Preventing blood pooling in the extremities", "3": "Grains", "4": "Oatmeal", "5": "Sympathy", "6": "Details", "7": "Serenity", "8": "Reconciliation", "9": "5-6 Hours", "10": "False"}, timestamp: "2023-12-25T18:00:00.000Z"})
  const h2f_res15 = await Survey_R.create({survey_id: 1, version: 1, email: "brian.chen@army.mil", results: {"1": "300 minutes", "2": "Increase the body's ability to burn fat", "3": "Rice", "4": "White Bread", "5": "Mind Reading", "6": "Centralizing", "7": "Mindfulness", "8": "Engagement", "9": "6-7 Hours", "10": "True"}, timestamp: "2024-01-01T00:00:00.000Z"})
  const h2f_res16 = await Survey_R.create({survey_id: 1, version: 1, email: "jessica.wang@army.mil", results: {"1": "150 minutes", "2": "Enhancing Flexibility and range of motion", "3": "Fruits", "4": "Brown Rice", "5": "Empathy", "6": "Processing", "7": "Inner Peace", "8": "Compatibility", "9": "7-8 Hours", "10": "False"}, timestamp: "2024-03-01T09:30:30.000Z"})
  const h2f_res17 = await Survey_R.create({survey_id: 1, version: 1, email: "kevin.zhang@army.mil", results: {"1": "30 minutes", "2": "Slowly reducing heart rate", "3": "Protein", "4": "Popcorn", "5": "Kinesis", "6": "Attention", "7": "Serenity", "8": "Reconciliation", "9": "4-5 Hours", "10": "True"}, timestamp: "2024-05-16T15:45:15.000Z"})
  const h2f_res18 = await Survey_R.create({survey_id: 1, version: 1, email: "michelle.li@army.mil", results: {"1": "75 minutes", "2": "Preventing blood pooling in the extremities", "3": "Grains", "4": "Oatmeal", "5": "Sympathy", "6": "Details", "7": "Mindfulness", "8": "Engagement", "9": "5-6 Hours", "10": "False"}, timestamp: "2024-05-16T17:20:20.000Z"})
  const h2f_res19 = await Survey_R.create({survey_id: 1, version: 1, email: "andrew.wu@army.mil", results: {"1": "75 minutes", "2": "Slowly reducing heart rate", "3": "Fruits", "4": "Popcorn", "5": "Sympathy", "6": "Attention", "7": "Mindfulness", "8": "Engagement", "9": "6-7 Hours", "10": "False"}, timestamp: "2024-07-20T08:20:20.000Z"})
  const h2f_res20 = await Survey_R.create({survey_id: 1, version: 1, email: "stephanie.chang@army.mil", results: {"1": "30 minutes", "2": "Enhancing Flexibility and range of motion", "3": "Protein", "4": "Brown Rice", "5": "Empathy", "6": "Processing", "7": "Inner Peace", "8": "Compatibility", "9": "7-8 Hours", "10": "True"}, timestamp: "2024-08-15T12:12:12.000Z"})
  const h2f_res21 = await Survey_R.create({survey_id: 1, version: 1, email: "jason.chen@army.mil", results: {"1": "150 minutes", "2": "Preventing blood pooling in the extremities", "3": "Grains", "4": "White Bread", "5": "Mind Reading", "6": "Details", "7": "Serenity", "8": "Reconciliation", "9": "5-6 Hours", "10": "False"}, timestamp: "2024-09-10T14:40:40.000Z"})
  const h2f_res22 = await Survey_R.create({survey_id: 1, version: 1, email: "rachel.liu@army.mil", results: {"1": "300 minutes", "2": "Slowly reducing heart rate", "3": "Rice", "4": "Oatmeal", "5": "Kinesis", "6": "Centralizing", "7": "Empathy", "8": "Engagement", "9": "4-5 Hours", "10": "True"}, timestamp: "2024-10-30T11:11:11.000Z"})
  const h2f_res23 = await Survey_R.create({survey_id: 1, version: 1, email: "eric.wang@army.mil", results: {"1": "30 minutes", "2": "Enhancing Flexibility and range of motion", "3": "Protein", "4": "Popcorn", "5": "Empathy", "6": "Attention", "7": "Inner Peace", "8": "Compatibility", "9": "6-7 Hours", "10": "False"}, timestamp: "2024-10-30T13:13:13.000Z"})
  const h2f_res24 = await Survey_R.create({survey_id: 1, version: 1, email: "catherine.zhang@army.mil", results: {"1": "150 minutes", "2": "Preventing blood pooling in the extremities", "3": "Grains", "4": "Brown Rice", "5": "Sympathy", "6": "Details", "7": "Mindfulness", "8": "Reconciliation", "9": "7-8 Hours", "10": "True"}, timestamp: "2024-11-02T00:14:38.000Z"})
  const h2f_res25 = await Survey_R.create({survey_id: 1, version: 1, email: "justin.chen@army.mil", results: {"1": "75 minutes", "2": "Increase the body's ability to burn fat", "3": "Fruits", "4": "White Bread", "5": "Mind Reading", "6": "Processing", "7": "Serenity", "8": "Engagement", "9": "5-6 Hours", "10": "False"}, timestamp: "2024-12-31T23:59:59.000Z"})
  const h2f_res26 = await Survey_R.create({survey_id: 1, version: 1, email: "grace.wu@army.mil", results: {"1": "300 minutes", "2": "Slowly reducing heart rate", "3": "Rice", "4": "Oatmeal", "5": "Kinesis", "6": "Centralizing", "7": "Empathy", "8": "Compatibility", "9": "4-5 Hours", "10": "True"}, timestamp: "2024-12-31T23:59:59.000Z"})
  const h2f_res27 = await Survey_R.create({survey_id: 1, version: 1, email: "steven.liu@army.mil", results: {"1": "30 minutes", "2": "Enhancing Flexibility and range of motion", "3": "Protein", "4": "Popcorn", "5": "Empathy", "6": "Attention", "7": "Inner Peace", "8": "Reconciliation", "9": "6-7 Hours", "10": "False"}, timestamp: "2024-12-31T23:59:59.000Z"})
  


  const survey_res1  = await Survey_R.create({survey_id: 2, version: 1, email: "user", results: {"1": 7, "2": 6, "3": 8, "4": 5, "5": 7, "6": 6, "7": 8, "8": 5, "9": 7, "10": 6, "11": 8, "12": 5, "13": 7, "14": 6, "15": 8}, timestamp: "2023-01-12T08:20:30.000Z"})
  const survey_res2  = await Survey_R.create({survey_id: 2, version: 1, email: "jill.shawn@army.mil", results: {"1": 9, "2": 7, "3": 8, "4": 6, "5": 8, "6": 7, "7": 5, "8": 7, "9": 8, "10": 6, "11": 4, "12": 6, "13": 7, "14": 8, "15": 9}, timestamp: "2023-01-12T10:15:45.000Z"})
  const survey_res3  = await Survey_R.create({survey_id: 2, version: 1, email: "joe.johnson@army.mil", results: {"1": 6, "2": 7, "3": 5, "4": 7, "5": 6, "6": 8, "7": 9, "8": 6, "9": 4, "10": 8, "11": 7, "12": 6, "13": 5, "14": 7, "15": 8}, timestamp: "2023-02-18T13:00:00.000Z"})
  const survey_res4  = await Survey_R.create({survey_id: 2, version: 1, email: "adam.smith@army.mil", results: {"1": 8, "2": 7, "3": 6, "4": 8, "5": 7, "6": 6, "7": 5, "8": 7, "9": 8, "10": 7, "11": 6, "12": 5, "13": 7, "14": 8, "15": 9}, timestamp: "2023-03-22T18:30:00.000Z"})
  const survey_res5  = await Survey_R.create({survey_id: 2, version: 1, email: "john.don@army.mil", results: {"1": 8, "2": 6, "3": 9, "4": 5, "5": 7, "6": 7, "7": 6, "8": 8, "9": 5, "10": 7, "11": 8, "12": 6, "13": 5, "14": 7, "15": 6}, timestamp: "2023-03-22T20:45:00.000Z"})
  const survey_res6  = await Survey_R.create({survey_id: 2, version: 1, email: "jane.jackson@army.mil", results: {"1": 5, "2": 7, "3": 6, "4": 4, "5": 6, "6": 8, "7": 9, "8": 7, "9": 5, "10": 8, "11": 7, "12": 5, "13": 6, "14": 7, "15": 9}, timestamp: "2023-04-15T07:15:15.000Z"})
  const survey_res7  = await Survey_R.create({survey_id: 2, version: 1, email: "mike.smith@army.mil", results: {"1": 6, "2": 8, "3": 5, "4": 7, "5": 7, "6": 5, "7": 6, "8": 8, "9": 9, "10": 6, "11": 5, "12": 7, "13": 6, "14": 8, "15": 5}, timestamp: "2023-05-19T06:22:11.000Z"})
  const survey_res8  = await Survey_R.create({survey_id: 2, version: 1, email: "emily.jones@army.mil", results: {"1": 9, "2": 8, "3": 7, "4": 5, "5": 8, "6": 7, "7": 6, "8": 5, "9": 7, "10": 8, "11": 9, "12": 8, "13": 7, "14": 6, "15": 5}, timestamp: "2023-06-30T16:45:25.000Z"})
  const survey_res9  = await Survey_R.create({survey_id: 2, version: 1, email: "david.brown@army.mil", results: {"1": 7, "2": 5, "3": 6, "4": 8, "5": 9, "6": 7, "7": 5, "8": 6, "9": 7, "10": 8, "11": 6, "12": 5, "13": 7, "14": 8, "15": 9}, timestamp: "2023-06-30T19:05:35.000Z"})
  const survey_res10 = await Survey_R.create({survey_id: 2, version: 1, email: "amy.wilson@army.mil", results: {"1": 6, "2": 7, "3": 8, "4": 9, "5": 6, "6": 5, "7": 7, "8": 6, "9": 8, "10": 7, "11": 9, "12": 8, "13": 7, "14": 6, "15": 5}, timestamp: "2023-07-04T00:00:00.000Z"})
  const survey_res11 = await Survey_R.create({survey_id: 2, version: 1, email: "mark.taylor@army.mil", results: {"1": 8, "2": 6, "3": 5, "4": 7, "5": 6, "6": 8, "7": 9, "8": 7, "9": 5, "10": 6, "11": 8, "12": 7, "13": 6, "14": 5, "15": 7}, timestamp: "2023-08-24T23:59:59.000Z"})
  const survey_res12 = await Survey_R.create({survey_id: 2, version: 1, email: "karen.anderson@army.mil", results: {"1": 9, "2": 7, "3": 8, "4": 6, "5": 5, "6": 7, "7": 6, "8": 8, "9": 9, "10": 7, "11": 5, "12": 6, "13": 7, "14": 8, "15": 6}, timestamp: "2023-10-13T05:05:05.000Z"})
  const survey_res13 = await Survey_R.create({survey_id: 2, version: 1, email: "chris.lee@army.mil", results: {"1": 7, "2": 8, "3": 9, "4": 7, "5": 6, "6": 5, "7": 4, "8": 6, "9": 7, "10": 8, "11": 9, "12": 7, "13": 6, "14": 5, "15": 7}, timestamp: "2023-11-02T00:14:38.000Z"})
  const survey_res14 = await Survey_R.create({survey_id: 2, version: 1, email: "lisa.kim@army.mil", results: {"1": 6, "2": 5, "3": 7, "4": 8, "5": 9, "6": 7, "7": 8, "8": 6, "9": 5, "10": 7, "11": 6, "12": 8, "13": 9, "14": 7, "15": 5}, timestamp: "2023-12-25T18:00:00.000Z"})
  const survey_res15 = await Survey_R.create({survey_id: 2, version: 1, email: "brian.chen@army.mil", results: {"1": 5, "2": 6, "3": 7, "4": 8, "5": 9, "6": 7, "7": 6, "8": 5, "9": 4, "10": 6, "11": 7, "12": 8, "13": 9, "14": 7, "15": 6}, timestamp: "2024-01-01T00:00:00.000Z"})
  const survey_res16 = await Survey_R.create({survey_id: 2, version: 1, email: "jessica.wang@army.mil", results: {"1": 8, "2": 9, "3": 7, "4": 6, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 7, "11": 6, "12": 5, "13": 7, "14": 8, "15": 9}, timestamp: "2024-03-01T09:30:30.000Z"})
  const survey_res17 = await Survey_R.create({survey_id: 2, version: 1, email: "kevin.zhang@army.mil", results: {"1": 7, "2": 5, "3": 6, "4": 7, "5": 8, "6": 9, "7": 7, "8": 5, "9": 6, "10": 7, "11": 8, "12": 9, "13": 7, "14": 5, "15": 6}, timestamp: "2024-05-16T15:45:15.000Z"})
  const survey_res18 = await Survey_R.create({survey_id: 2, version: 1, email: "michelle.li@army.mil", results: {"1": 6, "2": 7, "3": 8, "4": 9, "5": 7, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, "11": 7, "12": 5, "13": 6, "14": 7, "15": 8}, timestamp: "2024-05-16T17:20:20.000Z"})
  const survey_res19 = await Survey_R.create({survey_id: 2, version: 1, email: "andrew.wu@army.mil", results: {"1": 3, "2": 4, "3": 6, "4": 5, "5": 4, "6": 3, "7": 5, "8": 6, "9": 3, "10": 4, "11": 5, "12": 6, "13": 3, "14": 4, "15": 5}, timestamp: "2024-07-20T08:20:20.000Z"})
  const survey_res20 = await Survey_R.create({survey_id: 2, version: 1, email: "stephanie.chang@army.mil", results: {"1": 6, "2": 5, "3": 4, "4": 3, "5": 6, "6": 5, "7": 4, "8": 3, "9": 6, "10": 5, "11": 4, "12": 3, "13": 6, "14": 5, "15": 4}, timestamp: "2024-08-15T12:12:12.000Z"})
  const survey_res21 = await Survey_R.create({survey_id: 2, version: 1, email: "jason.chen@army.mil", results: {"1": 5, "2": 3, "3": 4, "4": 6, "5": 5, "6": 3, "7": 4, "8": 6, "9": 5, "10": 3, "11": 4, "12": 6, "13": 5, "14": 3, "15": 4}, timestamp: "2024-09-10T14:40:40.000Z"})
  const survey_res22 = await Survey_R.create({survey_id: 2, version: 1, email: "rachel.liu@army.mil", results: {"1": 4, "2": 6, "3": 5, "4": 4, "5": 3, "6": 6, "7": 5, "8": 4, "9": 3, "10": 6, "11": 5, "12": 4, "13": 3, "14": 6, "15": 5}, timestamp: "2024-10-30T11:11:11.000Z"})
  const survey_res23 = await Survey_R.create({survey_id: 2, version: 1, email: "eric.wang@army.mil", results: {"1": 3, "2": 5, "3": 6, "4": 4, "5": 3, "6": 5, "7": 6, "8": 4, "9": 3, "10": 5, "11": 6, "12": 4, "13": 3, "14": 5, "15": 6}, timestamp: "2024-10-30T13:13:13.000Z"})
  const survey_res24 = await Survey_R.create({survey_id: 2, version: 1, email: "catherine.zhang@army.mil", results: {"1": 6, "2": 4, "3": 3, "4": 5, "5": 6, "6": 4, "7": 3, "8": 5, "9": 6, "10": 4, "11": 3, "12": 5, "13": 6, "14": 4, "15": 3}, timestamp: "2024-11-02T00:14:38.000Z"})
  const survey_res25 = await Survey_R.create({survey_id: 2, version: 1, email: "justin.chen@army.mil", results: {"1": 5, "2": 3, "3": 6, "4": 4, "5": 5, "6": 3, "7": 6, "8": 4, "9": 5, "10": 3, "11": 6, "12": 4, "13": 5, "14": 3, "15": 6}, timestamp: "2024-12-31T23:59:59.000Z"})
  const survey_res26 = await Survey_R.create({survey_id: 2, version: 1, email: "grace.wu@army.mil", results: {"1": 4, "2": 5, "3": 3, "4": 6, "5": 4, "6": 5, "7": 3, "8": 6, "9": 4, "10": 5, "11": 3, "12": 6, "13": 4, "14": 5, "15": 3}, timestamp: "2024-12-31T23:59:59.000Z"})
  const survey_res27 = await Survey_R.create({survey_id: 2, version: 1, email: "steven.liu@army.mil", results: {"1": 7, "2": 5, "3": 6, "4": 8, "5": 7, "6": 5, "7": 7, "8": 6, "9": 8, "10": 7, "11": 6, "12": 8, "13": 5, "14": 7, "15": 6}, timestamp: "2024-12-31T23:59:59.000Z"})

  


  const fms1  = await Survey_R.create({survey_id: 3, version: 1, email: "user", results: {"1": "Alice", "2": 2, "3": 3, "4": 1, "5": 3, "6": 2, "7": 2, "8": 1}, timestamp: "2023-01-12T08:20:30.000Z"})
  const fms2  = await Survey_R.create({survey_id: 3, version: 1, email: "jill.shawn@army.mil", results: {"1": "Brandon", "2": 3, "3": 2, "4": 2, "5": 2, "6": 3, "7": 3, "8": 2}, timestamp: "2023-01-12T10:15:45.000Z"})
  const fms3  = await Survey_R.create({survey_id: 3, version: 1, email: "joe.johnson@army.mil", results: {"1": "Cameron", "2": 1, "3": 2, "4": 3, "5": 0, "6": 1, "7": 2, "8": 3}, timestamp: "2023-02-18T13:00:00.000Z"})
  const fms4  = await Survey_R.create({survey_id: 3, version: 1, email: "adam.smith@army.mil", results: {"1": "Diana", "2": 2, "3": 2, "4": 2, "5": 3, "6": 2, "7": 2, "8": 2}, timestamp: "2023-03-22T18:30:00.000Z"})
  const fms5  = await Survey_R.create({survey_id: 3, version: 1, email: "john.don@army.mil", results: {"1": "Edward", "2": 2, "3": 2, "4": 3, "5": 2, "6": 3, "7": 3, "8": 2}, timestamp: "2023-03-22T20:45:00.000Z"})
  const fms6  = await Survey_R.create({survey_id: 3, version: 1, email: "jane.jackson@army.mil", results: {"1": "Fiona", "2": 0, "3": 0, "4": 3, "5": 1, "6": 2, "7": 3, "8": 1}, timestamp: "2023-04-15T07:15:15.000Z"})
  const fms7  = await Survey_R.create({survey_id: 3, version: 1, email: "mike.smith@army.mil", results: {"1": "George", "2": 3, "3": 2, "4": 2, "5": 2, "6": 3, "7": 2, "8": 3}, timestamp: "2023-05-19T06:22:11.000Z"})
  const fms8  = await Survey_R.create({survey_id: 3, version: 1, email: "emily.jones@army.mil", results: {"1": "Hannah", "2": 2, "3": 3, "4": 2, "5": 0, "6": 3, "7": 3, "8": 2}, timestamp: "2023-06-30T16:45:25.000Z"})
  const fms9  = await Survey_R.create({survey_id: 3, version: 1, email: "david.brown@army.mil", results: {"1": "Ian", "2": 1, "3": 1, "4": 1, "5": 3, "6": 3, "7": 2, "8": 3}, timestamp: "2023-06-30T19:05:35.000Z"})
  const fms10 = await Survey_R.create({survey_id: 3, version: 1, email: "amy.wilson@army.mil", results: {"1": "Jessica", "2": 2, "3": 3, "4": 2, "5": 1, "6": 2, "7": 0, "8": 3}, timestamp: "2023-07-04T00:00:00.000Z"})
  const fms11 = await Survey_R.create({survey_id: 3, version: 1, email: "mark.taylor@army.mil", results: {"1": "Kyle", "2": 3, "3": 3, "4": 2, "5": 2, "6": 3, "7": 2, "8": 3}, timestamp: "2023-08-24T23:59:59.000Z"})
  const fms12 = await Survey_R.create({survey_id: 3, version: 1, email: "karen.anderson@army.mil", results: {"1": "Laura", "2": 2, "3": 2, "4": 3, "5": 3, "6": 2, "7": 2, "8": 2}, timestamp: "2023-10-13T05:05:05.000Z"})
  const fms13 = await Survey_R.create({survey_id: 3, version: 1, email: "chris.lee@army.mil", results: {"1": "Miguel", "2": 1, "3": 3, "4": 2, "5": 2, "6": 3, "7": 2, "8": 1}, timestamp: "2023-11-02T00:14:38.000Z"})
  const fms14 = await Survey_R.create({survey_id: 3, version: 1, email: "lisa.kim@army.mil", results: {"1": "Nancy", "2": 0, "3": 1, "4": 2, "5": 3, "6": 2, "7": 3, "8": 3}, timestamp: "2023-12-25T18:00:00.000Z"})
  const fms15 = await Survey_R.create({survey_id: 3, version: 1, email: "brian.chen@army.mil", results: {"1": "Oliver", "2": 2, "3": 3, "4": 2, "5": 2, "6": 2, "7": 3, "8": 2}, timestamp: "2024-01-01T00:00:00.000Z"})
  const fms16 = await Survey_R.create({survey_id: 3, version: 1, email: "jessica.wang@army.mil", results: {"1": "Pamela", "2": 1, "3": 2, "4": 2, "5": 3, "6": 1, "7": 2, "8": 3}, timestamp: "2024-03-01T09:30:30.000Z"})
  const fms17 = await Survey_R.create({survey_id: 3, version: 1, email: "kevin.zhang@army.mil", results: {"1": "Quentin", "2": 3, "3": 0, "4": 1, "5": 2, "6": 3, "7": 2, "8": 0}, timestamp: "2024-05-16T15:45:15.000Z"})
  const fms18 = await Survey_R.create({survey_id: 3, version: 1, email: "michelle.li@army.mil", results: {"1": "Rachel", "2": 2, "3": 1, "4": 3, "5": 2, "6": 2, "7": 1, "8": 3}, timestamp: "2024-05-16T17:20:20.000Z"})
  const fms19 = await Survey_R.create({survey_id: 3, version: 1, email: "andrew.wu@army.mil", results: {"1": "Steven", "2": 3, "3": 2, "4": 3, "5": 2, "6": 3, "7": 2, "8": 2}, timestamp: "2024-07-20T08:20:20.000Z"})
  const fms20 = await Survey_R.create({survey_id: 3, version: 1, email: "stephanie.chang@army.mil", results: {"1": "Travis", "2": 2, "3": 3, "4": 2, "5": 2, "6": 2, "7": 3, "8": 2}, timestamp: "2024-08-15T12:12:12.000Z"})
  const fms21 = await Survey_R.create({survey_id: 3, version: 1, email: "jason.chen@army.mil", results: {"1": "Ursula", "2": 2, "3": 2, "4": 3, "5": 2, "6": 2, "7": 2, "8": 3}, timestamp: "2024-09-10T14:40:40.000Z"})
  const fms22 = await Survey_R.create({survey_id: 3, version: 1, email: "rachel.liu@army.mil", results: {"1": "Victor", "2": 3, "3": 2, "4": 1, "5": 3, "6": 2, "7": 3, "8": 0}, timestamp: "2024-10-30T11:11:11.000Z"})
  const fms23 = await Survey_R.create({survey_id: 3, version: 1, email: "eric.wang@army.mil", results: {"1": "Wendy", "2": 0, "3": 1, "4": 2, "5": 3, "6": 2, "7": 1, "8": 2}, timestamp: "2024-10-30T13:13:13.000Z"})
  const fms24 = await Survey_R.create({survey_id: 3, version: 1, email: "catherine.zhang@army.mil", results: {"1": "Xavier", "2": 2, "3": 3, "4": 0, "5": 2, "6": 3, "7": 1, "8": 3}, timestamp: "2024-11-02T00:14:38.000Z"})
  const fms25 = await Survey_R.create({survey_id: 3, version: 1, email: "justin.chen@army.mil", results: {"1": "Yasmine", "2": 1, "3": 0, "4": 3, "5": 2, "6": 1, "7": 3, "8": 2}, timestamp: "2024-12-31T23:59:59.000Z"})
  const fms26 = await Survey_R.create({survey_id: 3, version: 1, email: "grace.wu@army.mil", results: {"1": "Zachary", "2": 3, "3": 2, "4": 1, "5": 3, "6": 2, "7": 2, "8": 2}, timestamp: "2024-12-31T23:59:59.000Z"})
  const fms27 = await Survey_R.create({survey_id: 3, version: 1, email: "steven.liu@army.mil", results: {"1": "Alex", "2": 2, "3": 3, "4": 2, "5": 2, "6": 2, "7": 3, "8": 2}, timestamp: "2024-12-31T23:59:59.000Z"})  

  const core_res   = await Core_Result.create({user_email: "user", h2f_results: {"Sleep": 100, "Mental": 50, "Physical": 50, "Nutrition": 100, "Spiritual": 100}, cpa_results: {"Ability": 33, "Current": 32, "Motivation": 34}, h2f_flag: "PASSED", cpa_flag: "PASSED", fms_flag: "MFT" })
  const core_res1  = await Core_Result.create({user_email: "jill.shawn@army.mil", h2f_results: {"Sleep": 0, "Mental": 0, "Physical": 0, "Nutrition": 0, "Spiritual": 0}, cpa_results: {"Ability": 38, "Current": 33, "Motivation": 38}, h2f_flag: "Sleep-Mental-Physical-Nutrition-Spiritual", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res2  = await Core_Result.create({user_email: "joe.johnson@army.mil", h2f_results: {"Sleep": 50, "Mental": 0, "Physical": 0, "Nutrition": 0, "Spiritual": 0}, cpa_results: {"Ability": 31, "Current": 35, "Motivation": 33}, h2f_flag: "Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "PT" })
  const core_res3  = await Core_Result.create({user_email: "adam.smith@army.mil", h2f_results: {"Sleep": 0, "Mental": 50, "Physical": 0, "Nutrition": 0, "Spiritual": 0}, cpa_results: {"Ability": 36, "Current": 33, "Motivation": 35}, h2f_flag: "Sleep-Physical-Nutrition-Spiritual", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res4  = await Core_Result.create({user_email: "john.don@army.mil", h2f_results: {"Sleep": 100, "Mental": 50, "Physical": 50, "Nutrition": 0, "Spiritual": 50}, cpa_results: {"Ability": 35, "Current": 33, "Motivation": 32}, h2f_flag: "Nutrition", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res5  = await Core_Result.create({user_email: "jane.jackson@army.mil", h2f_results: {"Sleep": 0, "Mental": 0, "Physical": 0, "Nutrition": 0, "Spiritual": 50}, cpa_results: {"Ability": 28, "Current": 37, "Motivation": 34}, h2f_flag: "Sleep-Mental-Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "PT" })
  const core_res6  = await Core_Result.create({user_email: "mike.smith@army.mil", h2f_results: {"Sleep": 50, "Mental": 0, "Physical": 50, "Nutrition": 100, "Spiritual": 0}, cpa_results: {"Ability": 33, "Current": 34, "Motivation": 31}, h2f_flag: "Mental-Spiritual", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res7  = await Core_Result.create({user_email: "emily.jones@army.mil", h2f_results: {"Sleep": 50, "Mental": 100, "Physical": 50, "Nutrition": 0, "Spiritual": 50}, cpa_results: {"Ability": 37, "Current": 33, "Motivation": 35}, h2f_flag: "Nutrition", cpa_flag: "PASSED", fms_flag: "PT" })
  const core_res8  = await Core_Result.create({user_email: "david.brown@army.mil", h2f_results: {"Sleep": 50, "Mental": 0, "Physical": 0, "Nutrition": 0, "Spiritual": 50}, cpa_results: {"Ability": 35, "Current": 33, "Motivation": 35}, h2f_flag: "Mental-Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "MFT" })//
  const core_res9  = await Core_Result.create({user_email: "amy.wilson@army.mil", h2f_results: {"Sleep": 0, "Mental": 0, "Physical": 0, "Nutrition": 0, "Spiritual": 0}, cpa_results: {"Ability": 36, "Current": 33, "Motivation": 35}, h2f_flag: "Sleep-Mental-Physical-Nutrition-Spiritual", cpa_flag: "PASSED", fms_flag: "PT" })
  const core_res10 = await Core_Result.create({user_email: "mark.taylor@army.mil", h2f_results: {"Sleep": 50, "Mental": 0, "Physical": 50, "Nutrition": 100, "Spiritual": 50}, cpa_results: {"Ability": 32, "Current": 35, "Motivation": 33}, h2f_flag: "Mental", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res11 = await Core_Result.create({user_email: "karen.anderson@army.mil", h2f_results: {"Sleep": 50, "Mental": 100, "Physical": 50, "Nutrition": 0, "Spiritual": 50}, cpa_results: {"Ability": 35, "Current": 37, "Motivation": 34}, h2f_flag: "Nutrition", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res12 = await Core_Result.create({user_email: "chris.lee@army.mil", h2f_results: {"Sleep": 50, "Mental": 0, "Physical": 0, "Nutrition": 0, "Spiritual": 0}, cpa_results: {"Ability": 37, "Current": 30, "Motivation": 34}, h2f_flag: "Mental-Physical-Nutrition-Spiritual", cpa_flag: "PASSED", fms_flag: "MFT" })//
  const core_res13 = await Core_Result.create({user_email: "lisa.kim@army.mil", h2f_results: {"Sleep": 0, "Mental": 0, "Physical": 0, "Nutrition": 0, "Spiritual": 50}, cpa_results: {"Ability": 35, "Current": 33, "Motivation": 35}, h2f_flag: "Sleep-Mental-Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "PT" })
  const core_res14 = await Core_Result.create({user_email: "brian.chen@army.mil", h2f_results: {"Sleep": 50, "Mental": 0, "Physical": 50, "Nutrition": 100, "Spiritual": 50}, cpa_results: {"Ability": 35, "Current": 28, "Motivation": 35}, h2f_flag: "Mental", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res15 = await Core_Result.create({user_email: "jessica.wang@army.mil", h2f_results: {"Sleep": 50, "Mental": 100, "Physical": 50, "Nutrition": 0, "Spiritual": 0}, cpa_results: {"Ability": 35, "Current": 37, "Motivation": 35}, h2f_flag: "Nutrition-Spiritual", cpa_flag: "PASSED", fms_flag: "MFTT" })//
  const core_res16 = await Core_Result.create({user_email: "kevin.zhang@army.mil", h2f_results: {"Sleep": 50, "Mental": 0, "Physical": 0, "Nutrition": 0, "Spiritual": 50}, cpa_results: {"Ability": 33, "Current": 34, "Motivation": 35}, h2f_flag: "Mental-Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "PT" })
  const core_res17 = await Core_Result.create({user_email: "michelle.li@army.mil", h2f_results: {"Sleep": 0, "Mental": 0, "Physical": 0, "Nutrition": 0, "Spiritual": 50}, cpa_results: {"Ability": 37, "Current": 35, "Motivation": 33}, h2f_flag: "Sleep-Mental-Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "MFT" })
  const core_res18 = await Core_Result.create({user_email: "andrew.wu@army.mil", h2f_results: {"Sleep": 0, "Mental": 0, "Physical": 0, "Nutrition": 0, "Spiritual": 50}, cpa_results: {"Ability": 22, "Current": 21, "Motivation": 23}, h2f_flag: "Sleep-Mental-Physical-Nutrition", cpa_flag: "BH", fms_flag: "PASSED" })//
  const core_res19 = await Core_Result.create({user_email: "stephanie.chang@army.mil", h2f_results: {"Sleep": 100, "Mental": 100, "Physical": 0, "Nutrition": 0, "Spiritual": 0}, cpa_results: {"Ability": 24, "Current": 23, "Motivation": 22}, h2f_flag: "Physical-Nutrition-Spiritual", cpa_flag: "BH", fms_flag: "PASSED" })
  const core_res20 = await Core_Result.create({user_email: "jason.chen@army.mil", h2f_results: {"Sleep": 0, "Mental": 0, "Physical": 50, "Nutrition": 50, "Spiritual": 50}, cpa_results: {"Ability": 23, "Current": 23, "Motivation": 22}, h2f_flag: "Sleep-Mental", cpa_flag: "BH", fms_flag: "PASSED" })
  const core_res21 = await Core_Result.create({user_email: "rachel.liu@army.mil", h2f_results: {"Sleep": 50, "Mental": 0, "Physical": 0, "Nutrition": 50, "Spiritual": 0}, cpa_results: {"Ability": 22, "Current": 24, "Motivation": 23}, h2f_flag: "Mental-Physical-Spiritual", cpa_flag: "BH", fms_flag: "PT" })
  const core_res22 = await Core_Result.create({user_email: "eric.wang@army.mil", h2f_results: {"Sleep": 0, "Mental": 50, "Physical": 0, "Nutrition": 0, "Spiritual": 0}, cpa_results: {"Ability": 21, "Current": 23, "Motivation": 23}, h2f_flag: "Sleep-Physical-Nutrition-Spiritual", cpa_flag: "BH", fms_flag: "PT" })
  const core_res23 = await Core_Result.create({user_email: "catherine.zhang@army.mil", h2f_results: {"Sleep": 100, "Mental": 0, "Physical": 50, "Nutrition": 0, "Spiritual": 100}, cpa_results: {"Ability": 24, "Current": 22, "Motivation": 23}, h2f_flag: "Mental-Nutrition", cpa_flag: "BH", fms_flag: "PT" })
  const core_res24 = await Core_Result.create({user_email: "justin.chen@army.mil", h2f_results: {"Sleep": 0, "Mental": 50, "Physical": 50, "Nutrition": 50, "Spiritual": 0}, cpa_results: {"Ability": 23, "Current": 22, "Motivation": 24}, h2f_flag: "Sleep-Spiritual", cpa_flag: "BH", fms_flag: "PT" })
  const core_res25 = await Core_Result.create({user_email: "grace.wu@army.mil", h2f_results: {"Sleep": 50, "Mental": 0, "Physical": 0, "Nutrition": 50, "Spiritual": 0}, cpa_results: {"Ability": 22, "Current": 24, "Motivation": 22}, h2f_flag: "Mental-Physical-Spiritual", cpa_flag: "BH", fms_flag: "MFTT" })
  const core_res26 = await Core_Result.create({user_email: "steven.liu@army.mil", h2f_results: {"Sleep": 0, "Mental": 50, "Physical": 0, "Nutrition": 0, "Spiritual": 50}, cpa_results: {"Ability": 33, "Current": 33, "Motivation": 32}, h2f_flag: "Sleep-Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "PASSED" })

  
  const notification1 = await Notification.create({unit: "1st", core_assessment_id: 1, core_category: "Physical", description: "You have scores significantly lower than your peers in the Physical domain of the assessment specified above. Please contact your unit's physical therapist to schedule a consultation."})
  const notification2 = await Notification.create({unit: "1st", core_assessment_id: 1, core_category: "Nutrition",description: "You have scores significantly lower than your peers in the Nutrition domain of the assessment specified above. Please contact your unit's nutritionist to schedule a consultation."})
  const notification3 = await Notification.create({unit: "1st", core_assessment_id: 1, core_category: "Spiritual",description: "You have scores significantly lower than your peers in the Spiritual domain of the assessment specified above. Please contact your unit's Spiritul Specialist to schedule a consultation."})
  const notification4 = await Notification.create({unit: "1st", core_assessment_id: 1, core_category: "Mental",description: "You have scores significantly lower than your peers in the Mental domain of the assessment specified above. Please contact your unit's mental health specialist to schedule a consultation."})
  const notification5 = await Notification.create({unit: "1st", core_assessment_id: 1, core_category: "Sleep",description: "You have scores significantly lower than your peers in the Sleep domain of the assessment specified above. Please contact your unit's sleep specialist to schedule a consultation."})

  const notification6 = await Notification.create({unit: "1st", core_assessment_id: 2, core_category: "Motivation",description: "You have scores significantly lower than your peers in the Motivation domain of the assessment specified above. Please contact your unit's therapist to schedule a consultation.", resource_email: "John.Smith@gmail.com"})
  const notification7 = await Notification.create({unit: "1st", core_assessment_id: 2, core_category: "Ability",description: "You have scores significantly lower than your peers in the Ability domain of the assessment specified above. Please contact your unit's physical therapist to schedule a consultation."})
  const notification8 = await Notification.create({unit: "1st", core_assessment_id: 2, core_category: "Current",description: "You have scores significantly lower than your peers in the Current domain of the assessment specified above. Please contact your unit's therapist to schedule a consultation."})

  const notification9 = await Notification.create({unit: "1st", core_assessment_id: 3,  core_category: "PT", description: "You have scored a 0 on a specific exercise within the assessment specified above. Please contact your unit's physical therapist at jane.doe@army.mil to schedule a consultation.", resource_email: "John.Smith@gmail.com", resource_phone: "555-555-5555"})
  const notification10 = await Notification.create({unit: "1st", core_assessment_id: 3, core_category: "MFT", description: "You have scored a 1 on a specific exercise within the assessment specified above. Please contact your unit's master fitness trainer at john.smith@army.mil to schedule a consultation.", resource_email: "Jane.Doe@gmail.com", resource_phone: "333-333-3333" })


  console.log("Data Entered")
}


sequelize.sync({ force: true, alter: true }).then(() => {
  console.log("Database synced")
  setup().then(() => console.log("Setup completed"))
})

module.exports = app;
