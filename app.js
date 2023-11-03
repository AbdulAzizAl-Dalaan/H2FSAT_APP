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
   and weaknesses in the areas of Holistic Health and Fitness and must be completed by all members of the Army National Guard along with the PHA.", isCore: true, card_img: "/images/default_imgs/img3.png"})

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

  //Test answer for h2f*****************
  // const surveyResponse = async () => {
  //   try {
  //     
  //     const userEmail = 'test.user@email.com';
  
  //     
  //     const results = {
  //       1: 4, 
  //       2: 3, 
  //       3: 2, 
  //       4: 2, 
  //       5: 1, 
  //       6: 3, 
  //       7: 4, 
  //       8: 3, 
  //       9: 3, 
  //       10: 1, 
  //     };
  
  //     
  //     const surveyResult = await Survey_R.create({
  //       survey_id: 1,
  //       email: userEmail,
  //       results: results, // storing the results JSON object
  //       timestamp: new Date(),
  //       isOutdated: false
  //     });
  
  //     console.log('Survey response saved:', surveyResult);
  //     return surveyResult;
  //   } catch (error) {
  //     console.error('Error saving survey response:', error);
  //   }
  // };
  
  
  // surveyResponse();
  
  //Test answer for h2f*****************^^^^^



  const cpa_info = await Survey_Info.create({ author: "brian.harder@army.mil", title: "Cogntive Performance Assessment", description: "The Cognitive Performance Assessment of the Army National Guard is a comprehensive tool designed to holistically evaluate a service member's well-being, encompassing various domains of health and fitness. ", 
  isCore: true, card_img: "/images/default_imgs/img1.png"})
  
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
     physical performance. This systematic approach is vital for ensuring the readiness and resilience of the troops in the ever-demanding physical environments they encounter.", secure: true, password: "1234", isCore: true, card_img: "/images/default_imgs/img2.png"})

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

  const survey_one       = await Survey_Info.create({ author: "brian.harder@army.mil", title: "Survey One", description: "This is a test survey"})
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

  const res1 = await Survey_R.create({survey_id: 4, email: "user", results: {"1": "Seattle", "2": "de", "3": "10", "4": ["CPT_S 302", "CPT_S 350"], "5": "Yes"}})
  const res2 = await Survey_R.create({survey_id: 4, email: "jill.shawn@army.mil", results: {"1": "Pullman", "2": "Jill Shawn", "3": "7", "4": ["CPT_S 350", "CPT_S 360"], "5": "No"}})
  const res3 = await Survey_R.create({survey_id: 4, email: "joe.johnson@army.mil", results: {"1": "Olympia", "2": "Joe Johnson", "3": "5", "4": ["CPT_S 302", "CPT_S 360"], "5": "No"}})
  const res4 = await Survey_R.create({survey_id: 4, email: "adam.smith@army.mil", results: {"1": "Vancouver", "2": "Adam Smith", "3": "8", "4": ["CPT_S 302"], "5": "No"}})
  const res5 = await Survey_R.create({survey_id: 4, email: "john.don@army.mil", results: {"1": "Pullman", "2": "John Don", "3": "6", "4": ["CPT_S 350", "CPT_S 421"], "5": "Yes"}})
  const res6 = await Survey_R.create({survey_id: 4, email: "jane.jackson@army.mil", results: {"1": "Seattle", "2": "Jane Jackson", "3": "4", "4": ["CPT_S 302", "CPT_S 350", "CPT_S 421"], "5": "No"}})
  const res7 = await Survey_R.create({survey_id: 4, email: "mike.smith@army.mil", results: {"1": "Olympia", "2": "Mike Smith", "3": "2", "4": ["CPT_S 302", "CPT_S 350", "CPT_S 360", "CPT_S 421"], "5": "No"}})
  const res8 = await Survey_R.create({survey_id: 4, email: "emily.jones@army.mil", results: {"1": "Seattle", "2": "Emily Jones", "3": "9", "4": ["CPT_S 302", "CPT_S 360"], "5": "No"}})
  const res9 = await Survey_R.create({survey_id: 4, email: "david.brown@army.mil", results: {"1": "Olympia", "2": "David Brown", "3": "1", "4": ["CPT_S 302", "CPT_S 350"], "5": "No"}})
  const res10 = await Survey_R.create({survey_id: 4, email: "amy.wilson@army.mil", results: {"1": "Pullman", "2": "Amy Wilson", "3": "6", "4": ["CPT_S 302", "CPT_S 421"], "5": "No"}})
  const res11 = await Survey_R.create({survey_id: 4, email: "mark.taylor@army.mil", results: {"1": "Olympia", "2": "Mark Taylor", "3": "5", "4": ["CPT_S 302", "CPT_S 350", "CPT_S 421"], "5": "No"}})
  const res12 = await Survey_R.create({survey_id: 4, email: "karen.anderson@army.mil", results: {"1": "Olympia", "2": "Karen Anderson", "3": "7", "4": ["CPT_S 350"], "5": "Yes"}})
  const res13 = await Survey_R.create({survey_id: 4, email: "chris.lee@army.mil", results: {"1": "Olympia", "2": "Chris Lee", "3": "4", "4": ["CPT_S 302", "CPT_S 360"], "5": "Yes"}})
  const res14 = await Survey_R.create({survey_id: 4, email: "lisa.kim@army.mil", results: {"1": "Olympia", "2": "Lisa Kim", "3": "9", "4": ["CPT_S 360", "CPT_S 421"], "5": "Yes"}})
  const res15 = await Survey_R.create({survey_id: 4, email: "brian.chen@army.mil", results: {"1": "Olympia", "2": "Brian Chen", "3": "8", "4": ["CPT_S 350", "CPT_S 360"], "5": "No"}})
  const res16 = await Survey_R.create({survey_id: 4, email: "jessica.wang@army.mil", results: {"1": "Olympia", "2": "Jessica Wang", "3": "6", "4": ["CPT_S 302", "CPT_S 421"], "5": "No"}})
  const res17 = await Survey_R.create({survey_id: 4, email: "kevin.zhang@army.mil", results: {"1": "Olympia", "2": "Kevin Zhang", "3": "2", "4": ["CPT_S 350", "CPT_S 421"], "5": "No"}})
  const res18 = await Survey_R.create({survey_id: 4, email: "michelle.li@army.mil", results: {"1": "Olympia", "2": "Michelle Li", "3": "5", "4": ["CPT_S 302", "CPT_S 360"], "5": "No"}})
  const res19 = await Survey_R.create({survey_id: 4, email: "andrew.wu@army.mil", results: {"1": "Vancouver", "2": "Andrew Wu", "3": "7", "4": ["CPT_S 350", "CPT_S 360", "CPT_S 421"], "5": "No"}})
  const res20 = await Survey_R.create({survey_id: 4, email: "stephanie.chang@army.mil", results: {"1": "Pullman", "2": "Stephanie Chang", "3": "3", "4": ["CPT_S 421"], "5": "No"}})
  const res21 = await Survey_R.create({survey_id: 4, email: "jason.chen@army.mil", results: {"1": "Olympia", "2": "Jason Chen", "3": "4", "4": ["CPT_S 350", "CPT_S 421"], "5": "No"}})
  const res22 = await Survey_R.create({survey_id: 4, email: "rachel.liu@army.mil", results: {"1": "Olympia", "2": "Rachel Liu", "3": "9", "4": ["CPT_S 302", "CPT_S 350", "CPT_S 360", "CPT_S 421"], "5": "Yes"}})
  const res23 = await Survey_R.create({survey_id: 4, email: "eric.wang@army.mil", results: {"1": "Vancouver", "2": "Eric Wang", "3": "1", "4": ["CPT_S 360", "CPT_S 421"], "5": "Yes"}})
  const res24 = await Survey_R.create({survey_id: 4, email: "catherine.zhang@army.mil", results: {"1": "Olympia", "2": "Catherine Zhang", "3": "8", "4": ["CPT_S 302", "CPT_S 360", "CPT_S 421"], "5": "No"}})
  const res25 = await Survey_R.create({survey_id: 4, email: "justin.chen@army.mil", results: {"1": "Vancouver", "2": "Justin Chen", "3": "2", "4": ["CPT_S 302", "CPT_S 350"], "5": "Yes"}})
  const res26 = await Survey_R.create({survey_id: 4, email: "grace.wu@army.mil", results: {"1": "Olympia", "2": "Grace Wu", "3": "7", "4": ["CPT_S 360", "CPT_S 421"], "5": "No"}})
  const res27 = await Survey_R.create({survey_id: 4, email: "steven.liu@army.mil", results: {"1": "Seattle", "2": "Steven Liu", "3": "6", "4": ["CPT_S 302", "CPT_S 360"], "5": "Yes"}})

  const core_res = await Core_Result.create({user_email: "user", h2f_results: {"Sleep": 100, "Mental": 50, "Physical": 0, "Nutrition": 0, "Spiritual": 50}, cpa_results: {"Ability": 25, "Current": 15, "Motivation": 50}, h2f_flag: "Physical-Nutrition", cpa_flag: "BH", fms_flag: "PT" })
  
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
