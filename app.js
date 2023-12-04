var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const sequelize = require('./db');
const User = require('./models/User')
const Unit = require('./models/Unit')

const Survey_Info = require('./models/Survey/Survey_Info')
const Survey_Q = require('./models/Survey/Survey_Q')
const Survey_A = require('./models/Survey/Survey_A')
const Survey_R = require('./models/Survey/Survey_R')
const Survey_D = require('./models/Survey/Survey_D')
const Survey_V = require('./models/Survey/Survey_V')
const Core_Result = require('./models/Core_Result')
const Notification = require('./models/Notification')

Survey_Info.hasMany(Survey_Q)     // foreignKey "survey_id"
Survey_Q.belongsTo(Survey_Info)

Survey_Info.hasMany(Survey_A)     // foreignKey "survey_id"
Survey_A.belongsTo(Survey_Info)

User.hasMany(Survey_R)            // foreignKey "user_id"
Survey_R.belongsTo(User)

Survey_Info.hasMany(Survey_D)     // foreignKey "survey_id"
Survey_D.belongsTo(Survey_Info)

Survey_Info.hasMany(Survey_V)     // foreignKey "survey_id"
Survey_V.belongsTo(Survey_Info)

User.hasOne(Core_Result)          // foreignKey "user_id"
Core_Result.belongsTo(User)       // foreignKey "survey_id"

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');
var aboutRouter = require('./routes/about');
var createRouter = require('./routes/create');
var resultsRouter = require('./routes/results');
var uploadRoutes = require('./routes/upload');
var editDeleteRouter = require('./routes/edit-delete');
var notificationRouter = require('./routes/notification');
var profileRouter = require('./routes/profile');

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

app.use('/results', resultsRouter);
app.use('/edit', editDeleteRouter)
app.use('/notification', notificationRouter)
app.use('/profile', profileRouter)
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

  
  const adminTest = await User.create({ firstname: "test", lastname: "user", unit: "1st", email: "q", rank: "CPT", password: '1', gender: 'male', isAdmin: true, state: "WA", dob: "2001-03-22", gender: "Female" })

  // ALL ADMINS 
  const admin1 = await User.create({ firstname: "Brian", lastname: "Adams", unit: "1st",   email: "brian.adams@army.mil", rank: "CPT", password: '1234', isAdmin: true, state: "VA", dob: "1990-11-15", gender:"Male" })
  const admin2 = await User.create({ firstname: "Jake", lastname: "Johnson", unit: "2nd",  email: "jake.johnson@army.mil", rank: "2LT", password: '1234', isAdmin: true, state: "NC", dob: "1991-05-05", gender:"Male"  })
  const admin3 = await User.create({ firstname: "Danny", lastname: "Dans", unit: "3rd",    email: "danny.dans@army.mil", rank: "CPT", password: '1234', isAdmin: true, state: "PA", dob: "1995-11-20", gender:"Male"  })
  const amdin4 = await User.create({ firstname: "Percy", lastname: "Jackson", unit: "4th", email: "percy.jackson@army.mil", rank: "1LT", password: '1234', isAdmin: true, state: "VA", dob: "1991-10-25", gender:"Male"  })
  const admin5 = await User.create({ firstname: "Mark", lastname: "Zackary", unit: "5th",  email: "mark.zackary@army.mil", rank: "MAJ", password: '1234', isAdmin: true, state: "TX", dob: "1996-03-03", gender:"Male"  })

  // ALL UNIT LEADERS
  const ul1 = await User.create({ firstname: "Jane", lastname: "Doe", unit: "1st",   email: "jane.doe@army.mil" , isUnitLeader: true, rank: "1SG", state: "VA", password: "1234", dob: "1991-02-14", gender:"Female" });
  const ul2 = await User.create({ firstname: "Amy", lastname: "Wilson", unit: "2nd",  email: "amy.wilson@army.mil", isUnitLeader: true, rank: "MSG", state: "NC", password: "1234", dob: "1993-03-13", gender:"Female"  });
  const ul3 = await User.create({ firstname: "Andrew", lastname: "Wu", unit: "3rd",   email: "andrew.wu@army.mil", isUnitLeader: true, rank: "1SG", state: "PA", password: "1234", dob: "1993-10-25", gender:"Male" });
  const ul4 = await User.create({ firstname: "John", lastname: "Smith", unit: "4th",  email: "john.smith@army.mil", isUnitLeader: true, rank: "CSM", password: "1234",  state: "VA" , dob: "1997-11-29", gender:"Male" })
  const ul5 = await User.create({ firstname: "John", lastname: "Doe", unit: "5th",    email: "john.doe@army.mil",  isUnitLeader: true, rank: "SGT", password: "1234", state: "VA", dob: "1999-11-11", gender:"Male"  })


  // Users for the 1st unit
  const user = await User.create({ firstname: "Jimmy", lastname: "McGill", unit: "1st",   email: "jimmy.mcgill@army.mil", rank: "SGT", state: "VA" })
  const user2 = await User.create({ firstname: "Jill", lastname: "Shawn", unit: "1st", email: "jill.shawn@army.mil", rank: "PVT", state: "VA", dob: "2001-03-22", gender: "Female" });
  const user3 = await User.create({ firstname: "Joe", lastname: "Johnson", unit: "1st", email: "joe.johnson@army.mil", rank: "SGT", state: "VA", dob: "2000-07-11", gender: "Male" });
  const user4 = await User.create({ firstname: "Adam", lastname: "Smith", unit: "1st", email: "adam.smith@army.mil", rank: "Cpl", state: "VA", dob: "2001-08-11", gender:"Male" });
  const user5 = await User.create({ firstname: "John", lastname: "Don", unit: "1st", email: "john.don@army.mil", rank: "PVT", state: "VA", dob: "2002-05-05", gender:"Male" });
  const user6 = await User.create({ firstname: "Jane", lastname: "Jackson", unit: "1st", email: "jane.jackson@army.mil", rank: "SGT", state: "VA", dob: "1992-11-05", gender:"Female" });
  const user7 = await User.create({ firstname: "Mike", lastname: "Smith", unit: "1st", email: "mike.smith@army.mil", rank: "PVT", state: "VA", dob: "2003-01-13", gender:"Male" });
  const user8 = await User.create({ firstname: "Emily", lastname: "Jones", unit: "1st", email: "emily.jones@army.mil", rank: "PVT", state: "VA", dob: "2002-01-01", gender:"Female" });
  const user9 = await User.create({ firstname: "David", lastname: "Brown", unit: "1st", email: "david.brown@army.mil", rank: "SGT", state: "VA", dob: "1996-09-19", gender:"Male" });

  // Users for the 2nd unit
  const user11 = await User.create({ firstname: "Mark", lastname: "Taylor", unit: "2nd", email: "mark.taylor@army.mil", rank: "PVT", state: "NC", dob: "1995-02-13", gender:"Male" });
  const user12 = await User.create({ firstname: "Karen", lastname: "Anderson", unit: "2nd", email: "karen.anderson@army.mil", rank: "SGT", state: "NC", dob: "1999-04-19", gender:"Female" });
  const user13 = await User.create({ firstname: "Chris", lastname: "Lee", unit: "2nd", email: "chris.lee@army.mil", rank: "PVT", state: "NC", dob: "2000-07-05", gender:"Male" });
  const user14 = await User.create({ firstname: "Lisa", lastname: "Kim", unit: "2nd", email: "lisa.kim@army.mil", rank: "PVT", state: "NC", dob: "2003-06-10", gender:"Female" });
  const user15 = await User.create({ firstname: "Brian", lastname: "Chen", unit: "2nd", email: "brian.chen@army.mil", rank: "SGT", state: "NC", dob: "1998-07-25", gender:"Male" });
  const user16 = await User.create({ firstname: "Jessica", lastname: "Wang", unit: "2nd", email: "jessica.wang@army.mil", rank: "PVT", state: "NC", dob: "2000-01-27", gender:"Female" });
  const user17 = await User.create({ firstname: "Kevin", lastname: "Zhang", unit: "2nd", email: "kevin.zhang@army.mil", rank: "PVT", state: "NC", dob: "2002-02-26", gender:"Male" });
  const user18 = await User.create({ firstname: "Michelle", lastname: "Li", unit: "2nd", email: "michelle.li@army.mil", rank: "SGT", state: "NC", dob: "1998-03-01", gender:"Female" });

  // Users for the 3rd unit
  const user20 = await User.create({ firstname: "Stephanie", lastname: "Chang", unit: "3rd", email: "stephanie.chang@army.mil", rank: "PVT", state: "PA", dob: "2004-08-29", gender:"Female" });
  const user21 = await User.create({ firstname: "Jason", lastname: "Chen", unit: "3rd", email: "jason.chen@army.mil", rank: "SGT", state: "PA", dob: "2000-11-05", gender:"Male" });
  const user22 = await User.create({ firstname: "Rachel", lastname: "Liu", unit: "3rd", email: "rachel.liu@army.mil", rank: "PVT", state: "PA", dob: "2000-12-20", gender:"Female" });
  const user23 = await User.create({ firstname: "Eric", lastname: "Wang", unit: "3rd", email: "eric.wang@army.mil", rank: "PVT", state: "PA", dob: "2001-03-20", gender:"Male" });
  const user24 = await User.create({ firstname: "Catherine", lastname: "Zhang", unit: "3rd", email: "catherine.zhang@army.mil", rank: "SGT", state: "PA", dob: "1994-12-01", gender:"Female" });
  const user25 = await User.create({ firstname: "Justin", lastname: "Chen", unit: "3rd", email: "justin.chen@army.mil", rank: "PVT", state: "PA", dob: "2005-03-10", gender:"Male" });
  const user26 = await User.create({ firstname: "Grace", lastname: "Wu", unit: "3rd", email: "grace.wu@army.mil", rank: "PVT", state: "PA", dob: "1997-02-05", gender:"Female" });
  const user27 = await User.create({ firstname: "Steven", lastname: "Liu", unit: "3rd", email: "steven.liu@army.mil", rank: "SGT", state: "PA", dob: "2004-06-16", gender:"Male" });

  // All Units
  const unit1 = await Unit.create({ uic: "1st", state: "VA", leader: "jane.doe@army.mil" })
  const unit2 = await Unit.create({ uic: "2nd", state: "NC", leader: "amy.wilson@army.mil"})
  const unit3 = await Unit.create({ uic: "3rd", state: "PA", leader: "andrew.wu@army.mil"})
  const unit4 = await Unit.create({ uic: "4th", state: "VA", leader: "john.smith@army.mil" })
  const unit5 = await Unit.create({ uic: "5th", state: "VA", leader: "john.doe@army.mil" })

  // Empty Users to enter profile information
  const empty_user1 = await User.create({ firstname: "Jack", lastname: "Reacher",     email: "jack.reacher@army.mil"})
  const empty_user2 = await User.create({ firstname: "Alice", lastname: "Johnson",    email: "alice.johnson@army.mil"});
  const empty_user3 = await User.create({ firstname: "Bob", lastname: "Smith",        email: "bob.smith@army.mil"});
  const empty_user4 = await User.create({ firstname: "Charlie", lastname: "Brown",    email: "charlie.brown@army.mil"});
  const empty_user5 = await User.create({ firstname: "David", lastname: "Williams",   email: "david.williams@army.mil"});
  const empty_user6 = await User.create({ firstname: "Emily", lastname: "Davis",      email: "emily.davis@army.mil"});
  const empty_user7 = await User.create({ firstname: "Frank", lastname: "Miller",     email: "frank.miller@army.mil"});
  const empty_user8 = await User.create({ firstname: "Grace", lastname: "Wilson",     email: "grace.wilson@army.mil"});
  const empty_user9 = await User.create({ firstname: "Harry", lastname: "Moore",      email: "harry.moore@army.mil"});
  const empty_user10 = await User.create({ firstname: "Ivy", lastname: "Taylor",      email: "ivy.taylor@army.mil"});
  const empty_user11 = await User.create({ firstname: "Jack", lastname: "Anderson",   email: "jack.anderson@army.mil"});
  const empty_user12 = await User.create({ firstname: "Kathy", lastname: "Thomas",    email: "kathy.thomas@army.mil"});
  const empty_user13 = await User.create({ firstname: "Larry", lastname: "Jackson",   email: "larry.jackson@army.mil"});
  const empty_user14 = await User.create({ firstname: "Molly", lastname: "White",     email: "molly.white@army.mil"});
  const empty_user15 = await User.create({ firstname: "Nathan", lastname: "Harris",   email: "nathan.harris@army.mil"});
  const empty_user16 = await User.create({ firstname: "Olivia", lastname: "Martin",   email: "olivia.martin@army.mil"});
  const empty_user17 = await User.create({ firstname: "Paul", lastname: "Thompson",   email: "paul.thompson@army.mil"});
  const empty_user18 = await User.create({ firstname: "Quincy", lastname: "Garcia",   email: "quincy.garcia@army.mil"});
  const empty_user19 = await User.create({ firstname: "Rachel", lastname: "Martinez", email: "rachel.martinez@army.mil"});
  const empty_user20 = await User.create({ firstname: "Finn", lastname: "Wolf",       email: "finn.wolf@army.mil"});
  const empty_user21 = await User.create({ firstname: "Sam", lastname: "Robinson",    email: "sam.robinson@army.mil"});
  const empty_user22 = await User.create({ firstname: "Tina", lastname: "Clark",      email: "tina.clark@army.mil"});
  const empty_user23 = await User.create({ firstname: "Uma", lastname: "Rodriguez",   email: "uma.rodriguez@army.mil"});
  const empty_user24 = await User.create({ firstname: "Victor", lastname: "Lewis",    email: "victor.lewis@army.mil"});
  const empty_user25 = await User.create({ firstname: "Wendy", lastname: "Walker",    email: "wendy.walker@army.mil"});
  const empty_user26 = await User.create({ firstname: "Xavier", lastname: "Hall",     email: "xavier.hall@army.mil"});
  const empty_user27 = await User.create({ firstname: "Yvonne", lastname: "Allen",    email: "yvonne.allen@army.mil"});
  const empty_user28 = await User.create({ firstname: "Zach", lastname: "Young",      email: "zach.young@army.mil"});
  const empty_user29 = await User.create({ firstname: "Amy", lastname: "King",        email: "amy.king@army.mil"});
  const empty_user30 = await User.create({ firstname: "Brian", lastname: "Wright",    email: "brian.wright@army.mil"});
  const empty_user31 = await User.create({ firstname: "Catherine", lastname: "Lee",   email: "catherine.lee@army.mil"});
  const empty_user32 = await User.create({ firstname: "Daniel", lastname: "Gonzalez", email: "daniel.gonzalez@army.mil"});
  const empty_user33 = await User.create({ firstname: "Eva", lastname: "Perez",       email: "eva.perez@army.mil"});
  const empty_user34 = await User.create({ firstname: "Fred", lastname: "Hernandez",  email: "fred.hernandez@army.mil"});
  const empty_user35 = await User.create({ firstname: "Gina", lastname: "Lopez",      email: "gina.lopez@army.mil"});
  const empty_user36 = await User.create({ firstname: "Hank", lastname: "Hill",       email: "hank.hill@army.mil"});
  const empty_user37 = await User.create({ firstname: "Irene", lastname: "Baker",     email: "irene.baker@army.mil"});
  const empty_user38 = await User.create({ firstname: "Jake", lastname: "Rivera",     email: "jake.rivera@army.mil"});
  const empty_user39 = await User.create({ firstname: "Kelly", lastname: "Campbell",  email: "kelly.campbell@army.mil"});
  const empty_user40 = await User.create({ firstname: "Liam", lastname: "Mitchell",   email: "liam.mitchell@army.mil"});
  const empty_user41 = await User.create({ firstname: "Mona", lastname: "Carter",     email: "mona.carter@army.mil"});
  const empty_user42 = await User.create({ firstname: "Ned", lastname: "Roberts",     email: "ned.roberts@army.mil"});
  const empty_user43 = await User.create({ firstname: "Oscar", lastname: "Turner",    email: "oscar.turner@army.mil"});
  const empty_user44 = await User.create({ firstname: "Pam", lastname: "Phillips",    email: "pam.phillips@army.mil"});
  const empty_user45 = await User.create({ firstname: "Quentin", lastname: "Evans",   email: "quentin.evans@army.mil"});



  const h2f_info = await Survey_Info.create({author: "brian.adams@army.mil", title: "Knowledge Check", description: "H2F is designed to optimize Soldier personal readiness,\
  reduce injury rates, improve rehabilitation after injury, and increase the overall effectiveness of the Total Army. These assessment tools are designed to help you identify your strengths\
   and weaknesses in the areas of Holistic Health and Fitness and must be completed by all members of the Army National Guard along with the PHA.", isCore: true, version: 1,  card_img: "/images/default_imgs/img3.png"})

  // KNOWLEDGE CHECK QUESTIONS 
  
  // Physical
  const h2f_q1    = await Survey_Q.create({survey_id: 1, question_id: 1, prompt: "How long should you cool down after a workout?", type: "multiple_choice", core_category: "Physical", header: "Physical"})
  const h2f_q1_a1 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 1, text: "30 minutes"})
  const h2f_q1_a2 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 2, text: "75 minutes"})
  const h2f_q1_a3 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 3, text: "300 minutes"})
  const h2f_q1_a4 = await Survey_A.create({survey_id: 1, question_id: 1, answer_id: 4, text: "150 minutes", is_correct: true}) // correct

  const h2f_q2    = await Survey_Q.create({survey_id: 1, question_id: 2, prompt: "All of the following can be results of doing a proper cool down after exercise EXCEPT:", type: "multiple_choice", core_category: "Physical"})
  const h2f_q2_a1 = await Survey_A.create({survey_id: 1, question_id: 2, answer_id: 1, text: "Slowly reducing heart rate"})
  const h2f_q2_a2 = await Survey_A.create({survey_id: 1, question_id: 2, answer_id: 2, text: "Preventing blood pooling in the extremities"})
  const h2f_q2_a3 = await Survey_A.create({survey_id: 1, question_id: 2, answer_id: 3, text: "Increase the body's ability to burn fat", is_correct: true}) // correct
  const h2f_q2_a4 = await Survey_A.create({survey_id: 1, question_id: 2, answer_id: 4, text: "Enhancing Flexibility and range of motion"})

  const h2f_q3    = await Survey_Q.create({survey_id: 1, question_id: 3, prompt: "Body composition and Body Mass Index (BMI) are the same thing.", type: "multiple_choice", core_category: "Physical"})
  const h2f_q3_a1 = await Survey_A.create({survey_id: 1, question_id: 3, answer_id: 1, text: "True"})
  const h2f_q3_a2 = await Survey_A.create({survey_id: 1, question_id: 3, answer_id: 2, text: "False", is_correct: true}) // correct

  const h2f_q4    = await Survey_Q.create({survey_id: 1, question_id: 4, prompt: "Static stretching should be done before a workout.", type: "multiple_choice", core_category: "Physical"})
  const h2f_q4_a1 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 1, text: "True"})
  const h2f_q4_a2 = await Survey_A.create({survey_id: 1, question_id: 4, answer_id: 2, text: "False", is_correct: true}) // correct

  const h2f_q5    = await Survey_Q.create({survey_id: 1, question_id: 5, prompt: "What is muscular endurance?", type: "multiple_choice", core_category: "Physical"})
  const h2f_q5_a1 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 1, text: "The ability of a muscle or muscle group to repetitively perform work for an extended period of time", is_correct: true}) // correct"
  const h2f_q5_a2 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 2, text: "Performing a greater number of repetitions and a variety of speeds when lifting"})
  const h2f_q5_a3 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 3, text: "The amount of force a muscle or group of muscles can generate"})
  const h2f_q5_a4 = await Survey_A.create({survey_id: 1, question_id: 5, answer_id: 4, text: "The ability to move quickly and easily"})

  const h2f_q6    = await Survey_Q.create({survey_id: 1, question_id: 6, prompt: "What is hypertrophy?", type: "multiple_choice", core_category: "Physical"})
  const h2f_q6_a1 = await Survey_A.create({survey_id: 1, question_id: 6, answer_id: 1, text: "The ability of the skeletal system to bear weight"})
  const h2f_q6_a2 = await Survey_A.create({survey_id: 1, question_id: 6, answer_id: 2, text: "A lift that requires the movement of at least 150 lbs."})
  const h2f_q6_a3 = await Survey_A.create({survey_id: 1, question_id: 6, answer_id: 3, text: "Increase in muscle size", is_correct: true}) // correct
  const h2f_q6_a4 = await Survey_A.create({survey_id: 1, question_id: 6, answer_id: 4, text: "Lifting a greater number of repetitions at low weight"})

  const h2f_q7    = await Survey_Q.create({survey_id: 1, question_id: 7, prompt: "Small muscle, or single joint exercises should be performed before large muscle, or multi-joint exercises", type: "multiple_choice", core_category: "Physical"})
  const h2f_q7_a1 = await Survey_A.create({survey_id: 1, question_id: 7, answer_id: 1, text: "True"})
  const h2f_q7_a2 = await Survey_A.create({survey_id: 1, question_id: 7, answer_id: 2, text: "False", is_correct: true}) // correct

  const h2f_q8    = await Survey_Q.create({survey_id: 1, question_id: 8, prompt: "All of the following are true about a dynamic warm up EXCEPT?", type: "multiple_choice", core_category: "Physical"})
  const h2f_q8_a1 = await Survey_A.create({survey_id: 1, question_id: 8, answer_id: 1, text: "A dynamic warm up should be done after exercise", is_correct: true}) // correct
  const h2f_q8_a2 = await Survey_A.create({survey_id: 1, question_id: 8, answer_id: 2, text: "A dynamic warm up should take 5-10 minutes"})
  const h2f_q8_a3 = await Survey_A.create({survey_id: 1, question_id: 8, answer_id: 3, text: "A dynamic warm up should increase your heart rate"})
  const h2f_q8_a4 = await Survey_A.create({survey_id: 1, question_id: 8, answer_id: 4, text: "A dynamic warm up can decrease risk of injury"})

  // Nutrition

  const h2f_q9    = await Survey_Q.create({survey_id: 1, question_id: 9, prompt: "Which of the following is not a food group:", type: "multiple_choice", core_category: "Nutrition", header: "Nutrition"})
  const h2f_q9_a1 = await Survey_A.create({survey_id: 1, question_id: 9, answer_id: 1, text: "Fruits"})
  const h2f_q9_a2 = await Survey_A.create({survey_id: 1, question_id: 9, answer_id: 2, text: "Rice", is_correct: true}) // correct
  const h2f_q9_a3 = await Survey_A.create({survey_id: 1, question_id: 9, answer_id: 3, text: "Grains"})
  const h2f_q9_a4 = await Survey_A.create({survey_id: 1, question_id: 9, answer_id: 4, text: "Protein"})

  const h2f_q10    = await Survey_Q.create({survey_id: 1, question_id: 10, prompt: "All of the following are examples of whole grains except:", type: "multiple_choice", core_category: "Nutrition"})
  const h2f_q10_a1 = await Survey_A.create({survey_id: 1, question_id: 10, answer_id: 1, text: "Brown Rice"})
  const h2f_q10_a2 = await Survey_A.create({survey_id: 1, question_id: 10, answer_id: 2, text: "White Bread", is_correct: true}) // correct
  const h2f_q10_a3 = await Survey_A.create({survey_id: 1, question_id: 10, answer_id: 3, text: "Popcorn"})
  const h2f_q10_a4 = await Survey_A.create({survey_id: 1, question_id: 10, answer_id: 4, text: "Oatmeal"})

  const h2f_q11    = await Survey_Q.create({survey_id: 1, question_id: 11, prompt: "All of the following are macronutrients except:", type: "multiple_choice", core_category: "Nutrition"})
  const h2f_q11_a1 = await Survey_A.create({survey_id: 1, question_id: 11, answer_id: 1, text: "Proteins"})
  const h2f_q11_a2 = await Survey_A.create({survey_id: 1, question_id: 11, answer_id: 2, text: "Fats"})
  const h2f_q11_a3 = await Survey_A.create({survey_id: 1, question_id: 11, answer_id: 3, text: "Vitamins", is_correct: true}) // correct
  const h2f_q11_a4 = await Survey_A.create({survey_id: 1, question_id: 11, answer_id: 4, text: "Carbohydrates"}) 

  const h2f_q12    = await Survey_Q.create({survey_id: 1, question_id: 12, prompt: "Which of the following is not true about carbohydrates?", type: "multiple_choice", core_category: "Nutrition"})
  const h2f_q12_a1 = await Survey_A.create({survey_id: 1, question_id: 12, answer_id: 1, text: "They are our body's primary source of fuel"})
  const h2f_q12_a2 = await Survey_A.create({survey_id: 1, question_id: 12, answer_id: 2, text: "They should be 35-45% of our total calories from food"})
  const h2f_q12_a3 = await Survey_A.create({survey_id: 1, question_id: 12, answer_id: 3, text: "Simple carbohydrates are filled with nutrients", is_correct: true}) // correct
  const h2f_q12_a4 = await Survey_A.create({survey_id: 1, question_id: 12, answer_id: 4, text: "Most carbs are broken down into sugar molecules"}) 

  const h2f_q13    = await Survey_Q.create({survey_id: 1, question_id: 13, prompt: "Fat contains 9 calories per gram.", type: "multiple_choice", core_category: "Nutrition"})
  const h2f_q13_a1 = await Survey_A.create({survey_id: 1, question_id: 13, answer_id: 1, text: "True", is_correct: true}) // correct
  const h2f_q13_a2 = await Survey_A.create({survey_id: 1, question_id: 13, answer_id: 2, text: "False"})

  const h2f_q14    = await Survey_Q.create({survey_id: 1, question_id: 14, prompt: "Which of the following does not contain saturated fat?", type: "multiple_choice", core_category: "Nutrition"})
  const h2f_q14_a1 = await Survey_A.create({survey_id: 1, question_id: 14, answer_id: 1, text: "Beef"})
  const h2f_q14_a2 = await Survey_A.create({survey_id: 1, question_id: 14, answer_id: 2, text: "Coconut Oil"})
  const h2f_q14_a3 = await Survey_A.create({survey_id: 1, question_id: 14, answer_id: 3, text: "Salmon", is_correct: true}) // correct
  const h2f_q14_a4 = await Survey_A.create({survey_id: 1, question_id: 14, answer_id: 4, text: "Butter"})

  const h2f_q15    = await Survey_Q.create({survey_id: 1, question_id: 15, prompt: "You should drink 50-75% of your body weight in ounces of water daily", type: "multiple_choice", core_category: "Nutrition"})
  const h2f_q15_a1 = await Survey_A.create({survey_id: 1, question_id: 15, answer_id: 1, text: "True", is_correct: true}) // correct
  const h2f_q15_a2 = await Survey_A.create({survey_id: 1, question_id: 15, answer_id: 2, text: "False"}) 

  // Mental

  const h2f_q16    = await Survey_Q.create({survey_id: 1, question_id: 16, prompt: "The ability to sense other people's emotions is known as:", type: "multiple_choice", core_category: "Mental", header: "Mental"})
  const h2f_q16_a1 = await Survey_A.create({survey_id: 1, question_id: 16, answer_id: 1, text: "Empathy", is_correct: true}) // correct
  const h2f_q16_a2 = await Survey_A.create({survey_id: 1, question_id: 16, answer_id: 2, text: "Kinesis"})
  const h2f_q16_a3 = await Survey_A.create({survey_id: 1, question_id: 16, answer_id: 3, text: "Mind Reading"})
  const h2f_q16_a4 = await Survey_A.create({survey_id: 1, question_id: 16, answer_id: 4, text: "Sympathy"})

  const h2f_q17    = await Survey_Q.create({survey_id: 1, question_id: 17, prompt: "The ability to sort through irrelevant information and thoughts to concentrate and focus on a specific task is known as:", type: "multiple_choice", core_category: "Mental"})
  const h2f_q17_a1 = await Survey_A.create({survey_id: 1, question_id: 17, answer_id: 1, text: "Attention"})
  const h2f_q17_a2 = await Survey_A.create({survey_id: 1, question_id: 17, answer_id: 2, text: "Centralizing"})
  const h2f_q17_a3 = await Survey_A.create({survey_id: 1, question_id: 17, answer_id: 3, text: "Processing", is_correct: true}) // correct
  const h2f_q17_a4 = await Survey_A.create({survey_id: 1, question_id: 17, answer_id: 4, text: "Details"})

  const h2f_q18    = await Survey_Q.create({survey_id: 1, question_id: 18, prompt: "Stress can cause all of the following except:", type: "multiple_choice", core_category: "Mental"})
  const h2f_q18_a1 = await Survey_A.create({survey_id: 1, question_id: 18, answer_id: 1, text: "Increased heart rate"})
  const h2f_q18_a2 = await Survey_A.create({survey_id: 1, question_id: 18, answer_id: 2, text: "Release of cortisol and adrenaline"})
  const h2f_q18_a3 = await Survey_A.create({survey_id: 1, question_id: 18, answer_id: 3, text: "Weight gain"})
  const h2f_q18_a4 = await Survey_A.create({survey_id: 1, question_id: 18, answer_id: 4, text: "Increased memory retention", is_correct: true}) // correct

  const h2f_q19    = await Survey_Q.create({survey_id: 1, question_id: 19, prompt: "Breathing can help control heart rate.", type: "multiple_choice", core_category: "Mental"})
  const h2f_q19_a1 = await Survey_A.create({survey_id: 1, question_id: 19, answer_id: 1, text: "True", is_correct: true}) // correct
  const h2f_q19_a2 = await Survey_A.create({survey_id: 1, question_id: 19, answer_id: 2, text: "False"})

  const h2f_q20    = await Survey_Q.create({survey_id: 1, question_id: 20, prompt: "Which of the following is not part of the SMART goal format?", type: "multiple_choice", core_category: "Mental"})
  const h2f_q20_a1 = await Survey_A.create({survey_id: 1, question_id: 20, answer_id: 1, text: "Special", is_correct: true}) // correct
  const h2f_q20_a2 = await Survey_A.create({survey_id: 1, question_id: 20, answer_id: 2, text: "Measurable"})
  const h2f_q20_a3 = await Survey_A.create({survey_id: 1, question_id: 20, answer_id: 3, text: "Specific"})
  const h2f_q20_a4 = await Survey_A.create({survey_id: 1, question_id: 20, answer_id: 4, text: "Achievable"})

  // Spiritual

  const h2f_q21    = await Survey_Q.create({survey_id: 1, question_id: 21, prompt: "The idea of learning how to be fully present and engaged in moment and aware of your thoughts and feelings without distraction or judgment is:", type: "multiple_choice", core_category: "Spiritual", header: "Spiritual"})
  const h2f_q21_a1 = await Survey_A.create({survey_id: 1, question_id: 21, answer_id: 1, text: "Inner Peace"})
  const h2f_q21_a2 = await Survey_A.create({survey_id: 1, question_id: 21, answer_id: 2, text: "Serenity"})
  const h2f_q21_a3 = await Survey_A.create({survey_id: 1, question_id: 21, answer_id: 3, text: "Empathy"})
  const h2f_q21_a4 = await Survey_A.create({survey_id: 1, question_id: 21, answer_id: 4, text: "Mindfulness", is_correct: true}) // correct

  const h2f_q22    = await Survey_Q.create({survey_id: 1, question_id: 22, prompt: "The process of two people or groups in a conflict agreeing to make amends or come to a truce is known as:", type: "multiple_choice", core_category: "Spiritual"})
  const h2f_q22_a1 = await Survey_A.create({survey_id: 1, question_id: 22, answer_id: 1, text: "Compatibility"})
  const h2f_q22_a2 = await Survey_A.create({survey_id: 1, question_id: 22, answer_id: 2, text: "Engagement"})
  const h2f_q22_a3 = await Survey_A.create({survey_id: 1, question_id: 22, answer_id: 3, text: "Reconciliation", is_correct: true}) // correct
  const h2f_q22_a4 = await Survey_A.create({survey_id: 1, question_id: 22, answer_id: 4, text: "Empathy"})

  const h2f_q23    = await Survey_Q.create({survey_id: 1, question_id: 23, prompt: "One has to believe in a religion to practice Spirituality:", type: "multiple_choice", core_category: "Spiritual"})
  const h2f_q23_a1 = await Survey_A.create({survey_id: 1, question_id: 23, answer_id: 1, text: "True"})
  const h2f_q23_a2 = await Survey_A.create({survey_id: 1, question_id: 23, answer_id: 2, text: "False", is_correct: true}) // correct

  const h2f_q24    = await Survey_Q.create({survey_id: 1, question_id: 24, prompt: "The ability to recover quickly from difficulties is known as:", type: "multiple_choice", core_category: "Spiritual"})
  const h2f_q24_a1 = await Survey_A.create({survey_id: 1, question_id: 24, answer_id: 1, text: "Flexibility"})
  const h2f_q24_a2 = await Survey_A.create({survey_id: 1, question_id: 24, answer_id: 2, text: "Confidence"}) 
  const h2f_q24_a3 = await Survey_A.create({survey_id: 1, question_id: 24, answer_id: 3, text: "Coping"})
  const h2f_q24_a4 = await Survey_A.create({survey_id: 1, question_id: 24, answer_id: 4, text: "Resilience", is_correct: true}) // correct

  const h2f_q25    = await Survey_Q.create({survey_id: 1, question_id: 25, prompt: "The active process in which you make a conscious decision to let go of negative feelings is:", type: "multiple_choice", core_category: "Spiritual"})
  const h2f_q25_a1 = await Survey_A.create({survey_id: 1, question_id: 25, answer_id: 1, text: "Forgiveness", is_correct: true}) // correct
  const h2f_q25_a2 = await Survey_A.create({survey_id: 1, question_id: 25, answer_id: 2, text: "Resentment"})
  const h2f_q25_a3 = await Survey_A.create({survey_id: 1, question_id: 25, answer_id: 3, text: "Hospitality"})
  const h2f_q25_a4 = await Survey_A.create({survey_id: 1, question_id: 25, answer_id: 4, text: "Compassion"})

  // Sleep

  const h2f_q26    = await Survey_Q.create({survey_id: 1, question_id: 26, prompt: "Adults need at least how many hours of sleep per night?", type: "multiple_choice", core_category: "Sleep", header: "Sleep"})
  const h2f_q26_a1 = await Survey_A.create({survey_id: 1, question_id: 26, answer_id: 1, text: "4-5 Hours"})
  const h2f_q26_a2 = await Survey_A.create({survey_id: 1, question_id: 26, answer_id: 2, text: "6-7 Hours"})
  const h2f_q26_a3 = await Survey_A.create({survey_id: 1, question_id: 26, answer_id: 3, text: "7-8 Hours", is_correct: true}) // correct
  const h2f_q26_a4 = await Survey_A.create({survey_id: 1, question_id: 26, answer_id: 4, text: "5-6 Hours"})

  const h2f_q27    = await Survey_Q.create({survey_id: 1, question_id: 27, prompt: "Being awake for more than 20 hours results in an impairment equal to a blood alcohol level of 0.08%.", type: "multiple_choice", core_category: "Sleep"})
  const h2f_q27_a1 = await Survey_A.create({survey_id: 1, question_id: 27, answer_id: 1, text: "True", is_correct: true}) // correct
  const h2f_q27_a2 = await Survey_A.create({survey_id: 1, question_id: 27, answer_id: 2, text: "False"})

  const h2f_q28    = await Survey_Q.create({survey_id: 1, question_id: 28, prompt: "Good sleep hygiene practices include all of the following except:", type: "multiple_choice", core_category: "Sleep"})
  const h2f_q28_a1 = await Survey_A.create({survey_id: 1, question_id: 28, answer_id: 1, text: "Sleep in a completely pitch black room"})
  const h2f_q28_a2 = await Survey_A.create({survey_id: 1, question_id: 28, answer_id: 2, text: "Sleep with music on low volume", is_correct: true}) // correct
  const h2f_q28_a3 = await Survey_A.create({survey_id: 1, question_id: 28, answer_id: 3, text: "Get a hot shower or bath one hour before laying down"})
  const h2f_q28_a4 = await Survey_A.create({survey_id: 1, question_id: 28, answer_id: 4, text: "The temperature of room you sleep in should be between 60-67⁰"}) 

  const h2f_q29    = await Survey_Q.create({survey_id: 1, question_id: 29, prompt: "If you are not asleep within the first 30 minutes of laying down you should get out of your bed.", type: "multiple_choice", core_category: "Sleep"})
  const h2f_q29_a1 = await Survey_A.create({survey_id: 1, question_id: 29, answer_id: 1, text: "True", is_correct: true}) // correct
  const h2f_q29_a2 = await Survey_A.create({survey_id: 1, question_id: 29, answer_id: 2, text: "False"})

  const h2f_q30    = await Survey_Q.create({survey_id: 1, question_id: 30, prompt: "All are factors you should consider when optimizing sleep duration and continuity except:", type: "multiple_choice", core_category: "Sleep"})
  const h2f_q30_a1 = await Survey_A.create({survey_id: 1, question_id: 30, answer_id: 1, text: "Sleep environment"})
  const h2f_q30_a2 = await Survey_A.create({survey_id: 1, question_id: 30, answer_id: 2, text: "Setting a pre-sleep routine"})
  const h2f_q30_a3 = await Survey_A.create({survey_id: 1, question_id: 30, answer_id: 3, text: "Synching sleep schedule with brain's natural circadian rhythm"}) 
  const h2f_q30_a4 = await Survey_A.create({survey_id: 1, question_id: 30, answer_id: 4, text: "Consuming full, heavy meal 2-3 hours before bedtime", is_correct: true}) // correct


  const cpa_info = await Survey_Info.create({ author: "brian.adams@army.mil", title: "Cognitive Performance", description: "The Cognitive Performance Assessment of the Army National Guard is a comprehensive tool designed to holistically evaluate a service member's well-being, encompassing various domains of health and fitness. ", 
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

  const fms_info = await Survey_Info.create({survey_id: 3, author: "brian.adams@army.mil", title: "Movement Screening", description: "The  Movement Screening is an assessment\
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

  const h2f_res1  = await Survey_R.create({survey_id: 1, version: 1, email: "jimmy.mcgill@army.mil", results: {"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "False", "4": "False", "5": "The ability of a muscle or muscle group to repetitively perform work for an extended period of time", "6": "Increase in muscle size", "7": "False", "8": "A dynamic warm up should be done after exercise", 
  "9": "Rice", "10": "White Bread", "11": "Vitamins", "12": "Simple carbohydrates are filled with nutrients", "13": "True", "14": "Salmon", "15": "True", "16": "Empathy", "17": "Processing", "18": "Increased memory retention", "19": "True", "20": "Special", "21": "Mindfulness", "22": "Reconciliation", "23": "False", "24": "Resilience", "25": "Forgiveness", "26": "7-8 Hours", "27": "True", "28": "Sleep with music on low volume", "29": "True", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2023-01-12T08:20:30.000Z"})
  
  const h2f_res2  = await Survey_R.create({survey_id: 1, version: 1, email: "jill.shawn@army.mil", results: {"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "False", "4": "False", "5": "The ability to move quickly and easily", "6": "Lifting a greater number of repetitions at low weight", "7": "False", "8": "A dynamic warm up should be done after exercise", "9": "Rice", "10": "Popcorn", "11": "Vitamins", "12": "They should be 35-45% of our total calories from food", "13": "False", "14": "Salmon", "15": "True", "16": "Mind Reading", "17": "Details", "18": "Release of cortisol and adrenaline", "19": "True", "20": "Special", "21": "Empathy", "22": "Reconciliation", "23": "False", "24": "Coping", "25": "Compassion", "26": "7-8 Hours", "27": "True", "28": "The temperature of room you sleep in should be between 60-67⁰", "29": "True", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2023-01-12T10:15:45.000Z"})
  const h2f_res3  = await Survey_R.create({survey_id: 1, version: 1, email: "joe.johnson@army.mil", results: {"1": "300 minutes", "2": "Increase the body's ability to burn fat", "3": "False", "4": "False", "5": "The ability of a muscle or muscle group to repetitively perform work for an extended period of time", "6": "Increase in muscle size", "7": "False", "8": "A dynamic warm up should be done after exercise", "9": "Fruits", "10": "White Bread", "11": "Vitamins", "12": "Simple carbohydrates are filled with nutrients", "13": "True", "14": "Butter", "15": "False", "16": "Sympathy", "17": "Centralizing", "18": "Weight gain", "19": "True", "20": "Special", "21": "Empathy", "22": "Reconciliation", "23": "True", "24": "Resilience", "25": "Resentment", "26": "7-8 Hours", "27": "True", "28": "Sleep with music on low volume", "29": "True", "30": "Synching sleep schedule with brain's natural circadian rhythm"}, timestamp: "2023-02-18T13:00:00.000Z"})
  const h2f_res4  = await Survey_R.create({survey_id: 1, version: 1, email: "adam.smith@army.mil", results: {"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "False", "4": "True", "5": "The ability of a muscle or muscle group to repetitively perform work for an extended period of time", "6": "Increase in muscle size", "7": "True", "8": "A dynamic warm up can decrease risk of injury", "9": "Protein", "10": "Popcorn", "11": "Carbohydrates", "12": "They should be 35-45% of our total calories from food", "13": "True", "14": "Beef", "15": "True", "16": "Kinesis", "17": "Processing", "18": "Release of cortisol and adrenaline", "19": "False", "20": "Special", "21": "Empathy", "22": "Reconciliation", "23": "True", "24": "Resilience", "25": "Hospitality", "26": "7-8 Hours", "27": "True", "28": "Sleep with music on low volume", "29": "True", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2023-03-22T18:30:00.000Z"})
  const h2f_res5  = await Survey_R.create({survey_id: 1, version: 1, email: "john.don@army.mil", results: {"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "True", "4": "True", "5": "The ability to move quickly and easily", "6": "Increase in muscle size", "7": "False", "8": "A dynamic warm up should take 5-10 minutes", "9": "Rice", "10": "Brown Rice", "11": "Vitamins", "12": "They should be 35-45% of our total calories from food", "13": "True", "14": "Coconut Oil", "15": "True", "16": "Kinesis", "17": "Details", "18": "Weight gain", "19": "False", "20": "Measurable", "21": "Inner Peace", "22": "Empathy", "23": "True", "24": "Resilience", "25": "Resentment", "26": "7-8 Hours", "27": "True", "28": "Get a hot shower or bath one hour before laying down", "29": "True", "30": "Sleep environment"}, timestamp: "2023-03-22T20:45:00.000Z"})
  const h2f_res6  = await Survey_R.create({survey_id: 1, version: 1, email: "jane.jackson@army.mil", results: {"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "True", "4": "True", "5": "Performing a greater number of repetitions and a variety of speeds when lifting", "6": "Increase in muscle size", "7": "True", "8": "A dynamic warm up should take 5-10 minutes", "9": "Rice", "10": "Popcorn", "11": "Proteins", "12": "Simple carbohydrates are filled with nutrients", "13": "True", "14": "Salmon", "15": "True", "16": "Empathy", "17": "Processing", "18": "Increased memory retention", "19": "True", "20": "Achievable", "21": "Empathy", "22": "Reconciliation", "23": "False", "24": "Resilience", "25": "Forgiveness", "26": "6-7 Hours", "27": "True", "28": "Sleep with music on low volume", "29": "True", "30": "Setting a pre-sleep routine"}, timestamp: "2023-04-15T07:15:15.000Z"})
  const h2f_res7  = await Survey_R.create({survey_id: 1, version: 1, email: "mike.smith@army.mil", results: {"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "True", "4": "False", "5": "Performing a greater number of repetitions and a variety of speeds when lifting", "6": "A lift that requires the movement of at least 150 lbs.", "7": "True", "8": "A dynamic warm up should increase your heart rate", "9": "Protein", "10": "White Bread", "11": "Vitamins", "12": "Simple carbohydrates are filled with nutrients", "13": "True", "14": "Salmon", "15": "False", "16": "Empathy", "17": "Processing", "18": "Increased heart rate", "19": "False", "20": "Specific", "21": "Inner Peace", "22": "Reconciliation", "23": "False", "24": "Coping", "25": "Compassion", "26": "7-8 Hours", "27": "True", "28": "Sleep with music on low volume", "29": "True", "30": "Setting a pre-sleep routine"}, timestamp: "2023-05-19T06:22:11.000Z"})
  const h2f_res8  = await Survey_R.create({survey_id: 1, version: 1, email: "emily.jones@army.mil", results: {"1": "300 minutes", "2": "Slowly reducing heart rate", "3": "True", "4": "True", "5": "The ability to move quickly and easily", "6": "Lifting a greater number of repetitions at low weight", "7": "False", "8": "A dynamic warm up should increase your heart rate", "9": "Protein", "10": "Popcorn", "11": "Carbohydrates", "12": "Most carbs are broken down into sugar molecules", "13": "False", "14": "Butter", "15": "False", "16": "Empathy", "17": "Attention", "18": "Increased heart rate", "19": "True", "20": "Special", "21": "Empathy", "22": "Reconciliation", "23": "True", "24": "Flexibility", "25": "Forgiveness", "26": "7-8 Hours", "27": "True", "28": "Sleep with music on low volume", "29": "True", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2023-06-30T16:45:25.000Z"})
  const h2f_res9  = await Survey_R.create({survey_id: 1, version: 1, email: "david.brown@army.mil", results: {"1": "75 minutes", "2": "Slowly reducing heart rate", "3": "True", "4": "True", "5": "The ability of a muscle or muscle group to repetitively perform work for an extended period of time", "6": "The ability of the skeletal system to bear weight", "7": "False", "8": "A dynamic warm up should take 5-10 minutes", "9": "Fruits", "10": "Oatmeal", "11": "Carbohydrates", "12": "Most carbs are broken down into sugar molecules", "13": "False", "14": "Beef", "15": "True", "16": "Empathy", "17": "Details", "18": "Increased heart rate", "19": "False", "20": "Specific", "21": "Inner Peace", "22": "Reconciliation", "23": "False", "24": "Confidence", "25": "Compassion", "26": "7-8 Hours", "27": "False", "28": "The temperature of room you sleep in should be between 60-67⁰", "29": "False", "30": "Synching sleep schedule with brain's natural circadian rhythm"}, timestamp: "2023-06-30T19:05:35.000Z"})
  const h2f_res11 = await Survey_R.create({survey_id: 1, version: 1, email: "mark.taylor@army.mil", results: {"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "True", "4": "False", "5": "The ability to move quickly and easily", "6": "The ability of the skeletal system to bear weight", "7": "True", "8": "A dynamic warm up should be done after exercise", "9": "Rice", "10": "Popcorn", "11": "Vitamins", "12": "They should be 35-45% of our total calories from food", "13": "True", "14": "Salmon", "15": "False", "16": "Empathy", "17": "Processing", "18": "Increased heart rate", "19": "False", "20": "Measurable", "21": "Empathy", "22": "Empathy", "23": "True", "24": "Resilience", "25": "Hospitality", "26": "7-8 Hours", "27": "False", "28": "Get a hot shower or bath one hour before laying down", "29": "True", "30": "Setting a pre-sleep routine"}, timestamp: "2023-08-24T23:59:59.000Z"})
  const h2f_res12 = await Survey_R.create({survey_id: 1, version: 1, email: "karen.anderson@army.mil", results: {"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "False", "4": "False", "5": "The ability of a muscle or muscle group to repetitively perform work for an extended period of time", "6": "The ability of the skeletal system to bear weight", "7": "True", "8": "A dynamic warm up should be done after exercise", "9": "Rice", "10": "White Bread", "11": "Vitamins", "12": "Simple carbohydrates are filled with nutrients", "13": "False", "14": "Salmon", "15": "True", "16": "Empathy", "17": "Processing", "18": "Weight gain", "19": "False", "20": "Special", "21": "Mindfulness", "22": "Compatibility", "23": "False", "24": "Resilience", "25": "Forgiveness", "26": "7-8 Hours", "27": "True", "28": "Sleep with music on low volume", "29": "False", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2023-10-13T05:05:05.000Z"})
  const h2f_res13 = await Survey_R.create({survey_id: 1, version: 1, email: "chris.lee@army.mil", results: {"1": "150 minutes", "2": "Enhancing Flexibility and range of motion", "3": "True", "4": "False", "5": "The ability of a muscle or muscle group to repetitively perform work for an extended period of time", "6": "Increase in muscle size", "7": "True", "8": "A dynamic warm up should increase your heart rate", "9": "Fruits", "10": "Popcorn", "11": "Proteins", "12": "Simple carbohydrates are filled with nutrients", "13": "True", "14": "Salmon", "15": "True", "16": "Mind Reading", "17": "Details", "18": "Increased heart rate", "19": "False", "20": "Specific", "21": "Inner Peace", "22": "Reconciliation", "23": "False", "24": "Flexibility", "25": "Forgiveness", "26": "7-8 Hours", "27": "True", "28": "The temperature of room you sleep in should be between 60-67⁰", "29": "True", "30": "Sleep environment"}, timestamp: "2023-11-02T00:14:38.000Z"})
  const h2f_res14 = await Survey_R.create({survey_id: 1, version: 1, email: "lisa.kim@army.mil", results: {"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "False", "4": "True", "5": "Performing a greater number of repetitions and a variety of speeds when lifting", "6": "Increase in muscle size", "7": "False", "8": "A dynamic warm up should increase your heart rate", "9": "Fruits", "10": "Oatmeal", "11": "Vitamins", "12": "They should be 35-45% of our total calories from food", "13": "True", "14": "Salmon", "15": "True", "16": "Empathy", "17": "Processing", "18": "Increased memory retention", "19": "True", "20": "Special", "21": "Mindfulness", "22": "Compatibility", "23": "False", "24": "Resilience", "25": "Hospitality", "26": "7-8 Hours", "27": "True", "28": "Sleep in a completely pitch black room", "29": "False", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2023-12-25T18:00:00.000Z"})
  const h2f_res15 = await Survey_R.create({survey_id: 1, version: 1, email: "brian.chen@army.mil", results: {"1": "30 minutes", "2": "Increase the body's ability to burn fat", "3": "False", "4": "True", "5": "Performing a greater number of repetitions and a variety of speeds when lifting", "6": "Increase in muscle size", "7": "True", "8": "A dynamic warm up should take 5-10 minutes", "9": "Protein", "10": "White Bread", "11": "Proteins", "12": "They should be 35-45% of our total calories from food", "13": "True", "14": "Coconut Oil", "15": "False", "16": "Mind Reading", "17": "Centralizing", "18": "Increased memory retention", "19": "False", "20": "Achievable", "21": "Inner Peace", "22": "Reconciliation", "23": "False", "24": "Coping", "25": "Resentment", "26": "7-8 Hours", "27": "False", "28": "Sleep with music on low volume", "29": "True", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2024-01-01T00:00:00.000Z"})
  const h2f_res16 = await Survey_R.create({survey_id: 1, version: 1, email: "jessica.wang@army.mil", results: {"1": "30 minutes", "2": "Increase the body's ability to burn fat", "3": "True", "4": "True", "5": "The amount of force a muscle or group of muscles can generate", "6": "Increase in muscle size", "7": "True", "8": "A dynamic warm up should take 5-10 minutes", "9": "Fruits", "10": "White Bread", "11": "Vitamins", "12": "They should be 35-45% of our total calories from food", "13": "True", "14": "Salmon", "15": "True", "16": "Empathy", "17": "Centralizing", "18": "Release of cortisol and adrenaline", "19": "True", "20": "Measurable", "21": "Empathy", "22": "Engagement", "23": "True", "24": "Confidence", "25": "Forgiveness", "26": "7-8 Hours", "27": "False", "28": "Get a hot shower or bath one hour before laying down", "29": "True", "30": "Synching sleep schedule with brain's natural circadian rhythm"}, timestamp: "2024-03-01T09:30:30.000Z"})
  const h2f_res17 = await Survey_R.create({survey_id: 1, version: 1, email: "kevin.zhang@army.mil", results: {"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "False", "4": "False", "5": "The ability of a muscle or muscle group to repetitively perform work for an extended period of time", "6": "Increase in muscle size", "7": "True", "8": "A dynamic warm up should take 5-10 minutes", "9": "Rice", "10": "White Bread", "11": "Vitamins", "12": "Simple carbohydrates are filled with nutrients", "13": "False", "14": "Butter", "15": "False", "16": "Empathy", "17": "Details", "18": "Increased memory retention", "19": "False", "20": "Specific", "21": "Mindfulness", "22": "Reconciliation", "23": "False", "24": "Flexibility", "25": "Hospitality", "26": "7-8 Hours", "27": "False", "28": "The temperature of room you sleep in should be between 60-67⁰", "29": "False", "30": "Setting a pre-sleep routine"}, timestamp: "2024-05-16T15:45:15.000Z"})
  const h2f_res18 = await Survey_R.create({survey_id: 1, version: 1, email: "michelle.li@army.mil", results: 	{"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "True", "4": "False", "5": "The ability of a muscle or muscle group to repetitively perform work for an extended period of time", "6": "Lifting a greater number of repetitions at low weight", "7": "True", "8": "A dynamic warm up can decrease risk of injury", "9": "Rice", "10": "White Bread", "11": "Fats", "12": "They are our body's primary source of fuel", "13": "False", "14": "Coconut Oil", "15": "False", "16": "Empathy", "17": "Processing", "18": "Increased memory retention", "19": "False", "20": "Achievable", "21": "Inner Peace", "22": "Empathy", "23": "False", "24": "Resilience", "25": "Forgiveness", "26": "7-8 Hours", "27": "False", "28": "Sleep with music on low volume", "29": "True", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2024-05-16T17:20:20.000Z"})
  const h2f_res20 = await Survey_R.create({survey_id: 1, version: 1, email: "stephanie.chang@army.mil", results: {"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "False", "4": "True", "5": "The amount of force a muscle or group of muscles can generate", "6": "The ability of the skeletal system to bear weight", "7": "True", "8": "A dynamic warm up should be done after exercise", "9": "Protein", "10": "Oatmeal", "11": "Proteins", "12": "Most carbs are broken down into sugar molecules", "13": "True", "14": "Salmon", "15": "True", "16": "Kinesis", "17": "Processing", "18": "Increased memory retention", "19": "True", "20": "Special", "21": "Serenity", "22": "Reconciliation", "23": "True", "24": "Resilience", "25": "Hospitality", "26": "7-8 Hours", "27": "True", "28": "The temperature of room you sleep in should be between 60-67⁰", "29": "True", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2024-08-15T12:12:12.000Z"})
  const h2f_res21 = await Survey_R.create({survey_id: 1, version: 1, email: "jason.chen@army.mil", results: 	{"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "True", "4": "False", "5": "The ability of a muscle or muscle group to repetitively perform work for an extended period of time", "6": "Lifting a greater number of repetitions at low weight", "7": "True", "8": "A dynamic warm up can decrease risk of injury", "9": "Fruits", "10": "Popcorn", "11": "Carbohydrates", "12": "Simple carbohydrates are filled with nutrients", "13": "True", "14": "Salmon", "15": "True", "16": "Empathy", "17": "Processing", "18": "Increased heart rate", "19": "False", "20": "Special", "21": "Inner Peace", "22": "Reconciliation", "23": "True", "24": "Confidence", "25": "Resentment", "26": "7-8 Hours", "27": "True", "28": "The temperature of room you sleep in should be between 60-67⁰", "29": "True", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2024-09-10T14:40:40.000Z"})
  const h2f_res22 = await Survey_R.create({survey_id: 1, version: 1, email: "rachel.liu@army.mil", results:{"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "False", "4": "False", "5": "The ability of a muscle or muscle group to repetitively perform work for an extended period of time", "6": "Increase in muscle size", "7": "True", "8": "A dynamic warm up can decrease risk of injury", "9": "Fruits", "10": "White Bread", "11": "Vitamins", "12": "They are our body's primary source of fuel", "13": "True", "14": "Salmon", "15": "True", "16": "Empathy", "17": "Processing", "18": "Increased heart rate", "19": "False", "20": "Special", "21": "Inner Peace", "22": "Engagement", "23": "True", "24": "Confidence", "25": "Hospitality", "26": "7-8 Hours", "27": "True", "28": "The temperature of room you sleep in should be between 60-67⁰", "29": "True", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2024-10-30T11:11:11.000Z"})
  const h2f_res23 = await Survey_R.create({survey_id: 1, version: 1, email: "eric.wang@army.mil", results: {"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "False", "4": "False", "5": "The ability of a muscle or muscle group to repetitively perform work for an extended period of time", "6": "Increase in muscle size", "7": "True", "8": "A dynamic warm up should be done after exercise", "9": "Rice", "10": "White Bread", "11": "Vitamins", "12": "Simple carbohydrates are filled with nutrients", "13": "True", "14": "Salmon", "15": "True", "16": "Empathy", "17": "Processing", "18": "Increased memory retention", "19": "True", "20": "Measurable", "21": "Serenity", "22": "Reconciliation", "23": "True", "24": "Resilience", "25": "Resentment", "26": "4-5 Hours", "27": "True", "28": "Sleep in a completely pitch black room", "29": "True", "30": "Setting a pre-sleep routine"}, timestamp: "2024-10-30T13:13:13.000Z"})
  const h2f_res24 = await Survey_R.create({survey_id: 1, version: 1, email: "catherine.zhang@army.mil", results: {"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "True", "4": "False", "5": "Performing a greater number of repetitions and a variety of speeds when lifting", "6": "A lift that requires the movement of at least 150 lbs.", "7": "False", "8": "A dynamic warm up should take 5-10 minutes", "9": "Rice", "10": "Popcorn", "11": "Carbohydrates", "12": "Most carbs are broken down into sugar molecules", "13": "True", "14": "Salmon", "15": "True", "16": "Mind Reading", "17": "Details", "18": "Weight gain", "19": "False", "20": "Special", "21": "Serenity", "22": "Reconciliation", "23": "True", "24": "Resilience", "25": "Resentment", "26": "7-8 Hours", "27": "True", "28": "Get a hot shower or bath one hour before laying down", "29": "True", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2024-11-02T00:14:38.000Z"})
  const h2f_res25 = await Survey_R.create({survey_id: 1, version: 1, email: "justin.chen@army.mil", results: {"1": "30 minutes", "2": "Slowly reducing heart rate", "3": "True", "4": "True", "5": "Performing a greater number of repetitions and a variety of speeds when lifting", "6": "Lifting a greater number of repetitions at low weight", "7": "True", "8": "A dynamic warm up should take 5-10 minutes", "9": "Fruits", "10": "Popcorn", "11": "Carbohydrates", "12": "They should be 35-45% of our total calories from food", "13": "False", "14": "Coconut Oil", "15": "False", "16": "Mind Reading", "17": "Centralizing", "18": "Weight gain", "19": "False", "20": "Measurable", "21": "Empathy", "22": "Engagement", "23": "True", "24": "Coping", "25": "Compassion", "26": "6-7 Hours", "27": "False", "28": "Get a hot shower or bath one hour before laying down", "29": "False", "30": "Synching sleep schedule with brain's natural circadian rhythm"}, timestamp: "2024-12-31T23:59:59.000Z"})
  const h2f_res26 = await Survey_R.create({survey_id: 1, version: 1, email: "grace.wu@army.mil", results:	{"1": "150 minutes", "2": "Increase the body's ability to burn fat", "3": "True", "4": "False", "5": "Performing a greater number of repetitions and a variety of speeds when lifting", "6": "A lift that requires the movement of at least 150 lbs.", "7": "True", "8": "A dynamic warm up can decrease risk of injury", "9": "Rice", "10": "White Bread", "11": "Carbohydrates", "12": "Simple carbohydrates are filled with nutrients", "13": "True", "14": "Salmon", "15": "True", "16": "Kinesis", "17": "Centralizing", "18": "Increased memory retention", "19": "True", "20": "Specific", "21": "Empathy", "22": "Reconciliation", "23": "True", "24": "Resilience", "25": "Forgiveness", "26": "7-8 Hours", "27": "True", "28": "Sleep with music on low volume", "29": "True", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2024-12-31T23:59:59.000Z"})
  const h2f_res27 = await Survey_R.create({survey_id: 1, version: 1, email: "steven.liu@army.mil", results: 	{"1": "150 minutes", "2": "Enhancing Flexibility and range of motion", "3": "True", "4": "True", "5": "The ability to move quickly and easily", "6": "A lift that requires the movement of at least 150 lbs.", "7": "True", "8": "A dynamic warm up should be done after exercise", "9": "Rice", "10": "White Bread", "11": "Carbohydrates", "12": "Most carbs are broken down into sugar molecules", "13": "False", "14": "Salmon", "15": "True", "16": "Empathy", "17": "Details", "18": "Release of cortisol and adrenaline", "19": "False", "20": "Special", "21": "Serenity", "22": "Empathy", "23": "False", "24": "Coping", "25": "Compassion", "26": "7-8 Hours", "27": "True", "28": "The temperature of room you sleep in should be between 60-67⁰", "29": "False", "30": "Consuming full, heavy meal 2-3 hours before bedtime"}, timestamp: "2024-12-31T23:59:59.000Z"})
  


  const survey_res1  = await Survey_R.create({survey_id: 2, version: 1, email: "jimmy.mcgill@army.mil", results: {"1": 7, "2": 6, "3": 8, "4": 5, "5": 7, "6": 6, "7": 8, "8": 5, "9": 7, "10": 6, "11": 8, "12": 5, "13": 7, "14": 6, "15": 8}, timestamp: "2023-01-12T08:20:30.000Z"})
  const survey_res2  = await Survey_R.create({survey_id: 2, version: 1, email: "jill.shawn@army.mil", results: {"1": 9, "2": 7, "3": 8, "4": 6, "5": 8, "6": 7, "7": 5, "8": 7, "9": 8, "10": 6, "11": 4, "12": 6, "13": 7, "14": 8, "15": 9}, timestamp: "2023-01-12T10:15:45.000Z"})
  const survey_res3  = await Survey_R.create({survey_id: 2, version: 1, email: "joe.johnson@army.mil", results: {"1": 6, "2": 7, "3": 5, "4": 7, "5": 6, "6": 8, "7": 9, "8": 6, "9": 4, "10": 8, "11": 7, "12": 6, "13": 5, "14": 7, "15": 8}, timestamp: "2023-02-18T13:00:00.000Z"})
  const survey_res4  = await Survey_R.create({survey_id: 2, version: 1, email: "adam.smith@army.mil", results: {"1": 8, "2": 7, "3": 6, "4": 8, "5": 7, "6": 6, "7": 5, "8": 7, "9": 8, "10": 7, "11": 6, "12": 5, "13": 7, "14": 8, "15": 9}, timestamp: "2023-03-22T18:30:00.000Z"})
  const survey_res5  = await Survey_R.create({survey_id: 2, version: 1, email: "john.don@army.mil", results: {"1": 8, "2": 6, "3": 9, "4": 5, "5": 7, "6": 7, "7": 6, "8": 8, "9": 5, "10": 7, "11": 8, "12": 6, "13": 5, "14": 7, "15": 6}, timestamp: "2023-03-22T20:45:00.000Z"})
  const survey_res6  = await Survey_R.create({survey_id: 2, version: 1, email: "jane.jackson@army.mil", results: {"1": 5, "2": 7, "3": 6, "4": 4, "5": 6, "6": 8, "7": 9, "8": 7, "9": 5, "10": 8, "11": 7, "12": 5, "13": 6, "14": 7, "15": 9}, timestamp: "2023-04-15T07:15:15.000Z"})
  const survey_res7  = await Survey_R.create({survey_id: 2, version: 1, email: "mike.smith@army.mil", results: {"1": 6, "2": 8, "3": 5, "4": 7, "5": 7, "6": 5, "7": 6, "8": 8, "9": 9, "10": 6, "11": 5, "12": 7, "13": 6, "14": 8, "15": 5}, timestamp: "2023-05-19T06:22:11.000Z"})
  const survey_res8  = await Survey_R.create({survey_id: 2, version: 1, email: "emily.jones@army.mil", results: {"1": 9, "2": 8, "3": 7, "4": 5, "5": 8, "6": 7, "7": 6, "8": 5, "9": 7, "10": 8, "11": 9, "12": 8, "13": 7, "14": 6, "15": 5}, timestamp: "2023-06-30T16:45:25.000Z"})
  const survey_res9  = await Survey_R.create({survey_id: 2, version: 1, email: "david.brown@army.mil", results: {"1": 7, "2": 5, "3": 6, "4": 8, "5": 9, "6": 7, "7": 5, "8": 6, "9": 7, "10": 8, "11": 6, "12": 5, "13": 7, "14": 8, "15": 9}, timestamp: "2023-06-30T19:05:35.000Z"})
  const survey_res11 = await Survey_R.create({survey_id: 2, version: 1, email: "mark.taylor@army.mil", results: {"1": 8, "2": 6, "3": 5, "4": 7, "5": 6, "6": 8, "7": 9, "8": 7, "9": 5, "10": 6, "11": 8, "12": 7, "13": 6, "14": 5, "15": 7}, timestamp: "2023-08-24T23:59:59.000Z"})
  const survey_res12 = await Survey_R.create({survey_id: 2, version: 1, email: "karen.anderson@army.mil", results: {"1": 9, "2": 7, "3": 8, "4": 6, "5": 5, "6": 7, "7": 6, "8": 8, "9": 9, "10": 7, "11": 5, "12": 6, "13": 7, "14": 8, "15": 6}, timestamp: "2023-10-13T05:05:05.000Z"})
  const survey_res13 = await Survey_R.create({survey_id: 2, version: 1, email: "chris.lee@army.mil", results: {"1": 7, "2": 8, "3": 9, "4": 7, "5": 6, "6": 5, "7": 4, "8": 6, "9": 7, "10": 8, "11": 9, "12": 7, "13": 6, "14": 5, "15": 7}, timestamp: "2023-11-02T00:14:38.000Z"})
  const survey_res14 = await Survey_R.create({survey_id: 2, version: 1, email: "lisa.kim@army.mil", results: {"1": 6, "2": 5, "3": 7, "4": 8, "5": 9, "6": 7, "7": 8, "8": 6, "9": 5, "10": 7, "11": 6, "12": 8, "13": 9, "14": 7, "15": 5}, timestamp: "2023-12-25T18:00:00.000Z"})
  const survey_res15 = await Survey_R.create({survey_id: 2, version: 1, email: "brian.chen@army.mil", results: {"1": 5, "2": 6, "3": 7, "4": 8, "5": 9, "6": 7, "7": 6, "8": 5, "9": 4, "10": 6, "11": 7, "12": 8, "13": 9, "14": 7, "15": 6}, timestamp: "2024-01-01T00:00:00.000Z"})
  const survey_res16 = await Survey_R.create({survey_id: 2, version: 1, email: "jessica.wang@army.mil", results: {"1": 8, "2": 9, "3": 7, "4": 6, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 7, "11": 6, "12": 5, "13": 7, "14": 8, "15": 9}, timestamp: "2024-03-01T09:30:30.000Z"})
  const survey_res17 = await Survey_R.create({survey_id: 2, version: 1, email: "kevin.zhang@army.mil", results: {"1": 7, "2": 5, "3": 6, "4": 7, "5": 8, "6": 9, "7": 7, "8": 5, "9": 6, "10": 7, "11": 8, "12": 9, "13": 7, "14": 5, "15": 6}, timestamp: "2024-05-16T15:45:15.000Z"})
  const survey_res18 = await Survey_R.create({survey_id: 2, version: 1, email: "michelle.li@army.mil", results: {"1": 6, "2": 7, "3": 8, "4": 9, "5": 7, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, "11": 7, "12": 5, "13": 6, "14": 7, "15": 8}, timestamp: "2024-05-16T17:20:20.000Z"})
  const survey_res20 = await Survey_R.create({survey_id: 2, version: 1, email: "stephanie.chang@army.mil", results: {"1": 6, "2": 5, "3": 4, "4": 3, "5": 6, "6": 5, "7": 4, "8": 3, "9": 6, "10": 5, "11": 4, "12": 3, "13": 6, "14": 5, "15": 4}, timestamp: "2024-08-15T12:12:12.000Z"})
  const survey_res21 = await Survey_R.create({survey_id: 2, version: 1, email: "jason.chen@army.mil", results: {"1": 5, "2": 3, "3": 4, "4": 6, "5": 5, "6": 3, "7": 4, "8": 6, "9": 5, "10": 3, "11": 4, "12": 6, "13": 5, "14": 3, "15": 4}, timestamp: "2024-09-10T14:40:40.000Z"})
  const survey_res22 = await Survey_R.create({survey_id: 2, version: 1,  email: "rachel.liu@army.mil", results: {"1": 4, "2": 6, "3": 5, "4": 4, "5": 3, "6": 6, "7": 5, "8": 4, "9": 3, "10": 6, "11": 5, "12": 4, "13": 3, "14": 6, "15": 5}, timestamp: "2024-10-30T11:11:11.000Z"})
  const survey_res23 = await Survey_R.create({survey_id: 2, version: 1, email: "eric.wang@army.mil", results: {"1": 3, "2": 5, "3": 6, "4": 4, "5": 3, "6": 5, "7": 6, "8": 4, "9": 3, "10": 5, "11": 6, "12": 4, "13": 3, "14": 5, "15": 6}, timestamp: "2024-10-30T13:13:13.000Z"})
  const survey_res24 = await Survey_R.create({survey_id: 2, version: 1, email: "catherine.zhang@army.mil", results: {"1": 6, "2": 4, "3": 3, "4": 5, "5": 6, "6": 4, "7": 3, "8": 5, "9": 6, "10": 4, "11": 3, "12": 5, "13": 6, "14": 4, "15": 3}, timestamp: "2024-11-02T00:14:38.000Z"})
  const survey_res25 = await Survey_R.create({survey_id: 2, version: 1, email: "justin.chen@army.mil", results: {"1": 5, "2": 3, "3": 6, "4": 4, "5": 5, "6": 3, "7": 6, "8": 4, "9": 5, "10": 3, "11": 6, "12": 4, "13": 5, "14": 3, "15": 6}, timestamp: "2024-12-31T23:59:59.000Z"})
  const survey_res26 = await Survey_R.create({survey_id: 2, version: 1, email: "grace.wu@army.mil", results: {"1": 4, "2": 5, "3": 3, "4": 6, "5": 4, "6": 5, "7": 3, "8": 6, "9": 4, "10": 5, "11": 3, "12": 6, "13": 4, "14": 5, "15": 3}, timestamp: "2024-12-31T23:59:59.000Z"})
  const survey_res27 = await Survey_R.create({survey_id: 2, version: 1, email: "steven.liu@army.mil", results: {"1": 7, "2": 5, "3": 6, "4": 8, "5": 7, "6": 5, "7": 7, "8": 6, "9": 8, "10": 7, "11": 6, "12": 8, "13": 5, "14": 7, "15": 6}, timestamp: "2024-12-31T23:59:59.000Z"})

  


  const fms1  = await Survey_R.create({survey_id: 3, version: 1, email: "jimmy.mcgill@army.mil", results: {"1": "Alice", "2": 2, "3": 3, "4": 1, "5": 3, "6": 2, "7": 2, "8": 1}, timestamp: "2023-01-12T08:20:30.000Z"})
  const fms2  = await Survey_R.create({survey_id: 3, version: 1, email: "jill.shawn@army.mil", results: {"1": "Brandon", "2": 3, "3": 2, "4": 2, "5": 2, "6": 3, "7": 3, "8": 2}, timestamp: "2023-01-12T10:15:45.000Z"})
  const fms3  = await Survey_R.create({survey_id: 3, version: 1, email: "joe.johnson@army.mil", results: {"1": "Cameron", "2": 1, "3": 2, "4": 3, "5": 0, "6": 1, "7": 2, "8": 3}, timestamp: "2023-02-18T13:00:00.000Z"})
  const fms4  = await Survey_R.create({survey_id: 3, version: 1, email: "adam.smith@army.mil", results: {"1": "Diana", "2": 2, "3": 2, "4": 2, "5": 3, "6": 2, "7": 2, "8": 2}, timestamp: "2023-03-22T18:30:00.000Z"})
  const fms5  = await Survey_R.create({survey_id: 3, version: 1, email: "john.don@army.mil", results: {"1": "Edward", "2": 2, "3": 2, "4": 3, "5": 2, "6": 3, "7": 3, "8": 2}, timestamp: "2023-03-22T20:45:00.000Z"})
  const fms6  = await Survey_R.create({survey_id: 3, version: 1, email: "jane.jackson@army.mil", results: {"1": "Fiona", "2": 0, "3": 0, "4": 3, "5": 1, "6": 2, "7": 3, "8": 1}, timestamp: "2023-04-15T07:15:15.000Z"})
  const fms7  = await Survey_R.create({survey_id: 3, version: 1, email: "mike.smith@army.mil", results: {"1": "George", "2": 3, "3": 2, "4": 2, "5": 2, "6": 3, "7": 2, "8": 3}, timestamp: "2023-05-19T06:22:11.000Z"})
  const fms8  = await Survey_R.create({survey_id: 3, version: 1, email: "emily.jones@army.mil", results: {"1": "Hannah", "2": 2, "3": 3, "4": 2, "5": 0, "6": 3, "7": 3, "8": 2}, timestamp: "2023-06-30T16:45:25.000Z"})
  const fms9  = await Survey_R.create({survey_id: 3, version: 1, email: "david.brown@army.mil", results: {"1": "Ian", "2": 1, "3": 1, "4": 1, "5": 3, "6": 3, "7": 2, "8": 3}, timestamp: "2023-06-30T19:05:35.000Z"})
  const fms11 = await Survey_R.create({survey_id: 3, version: 1, email: "mark.taylor@army.mil", results: {"1": "Kyle", "2": 3, "3": 3, "4": 2, "5": 2, "6": 3, "7": 2, "8": 3}, timestamp: "2023-08-24T23:59:59.000Z"})
  const fms12 = await Survey_R.create({survey_id: 3, version: 1, email: "karen.anderson@army.mil", results: {"1": "Laura", "2": 2, "3": 2, "4": 3, "5": 3, "6": 2, "7": 2, "8": 2}, timestamp: "2023-10-13T05:05:05.000Z"})
  const fms13 = await Survey_R.create({survey_id: 3, version: 1, email: "chris.lee@army.mil", results: {"1": "Miguel", "2": 1, "3": 3, "4": 2, "5": 2, "6": 3, "7": 2, "8": 1}, timestamp: "2023-11-02T00:14:38.000Z"})
  const fms14 = await Survey_R.create({survey_id: 3, version: 1, email: "lisa.kim@army.mil", results: {"1": "Nancy", "2": 0, "3": 1, "4": 2, "5": 3, "6": 2, "7": 3, "8": 3}, timestamp: "2023-12-25T18:00:00.000Z"})
  const fms15 = await Survey_R.create({survey_id: 3, version: 1, email: "brian.chen@army.mil", results: {"1": "Oliver", "2": 2, "3": 3, "4": 2, "5": 2, "6": 2, "7": 3, "8": 2}, timestamp: "2024-01-01T00:00:00.000Z"})
  const fms16 = await Survey_R.create({survey_id: 3, version: 1, email: "jessica.wang@army.mil", results: {"1": "Pamela", "2": 1, "3": 2, "4": 2, "5": 3, "6": 1, "7": 2, "8": 3}, timestamp: "2024-03-01T09:30:30.000Z"})
  const fms17 = await Survey_R.create({survey_id: 3, version: 1, email: "kevin.zhang@army.mil", results: {"1": "Quentin", "2": 3, "3": 0, "4": 1, "5": 2, "6": 3, "7": 2, "8": 0}, timestamp: "2024-05-16T15:45:15.000Z"})
  const fms18 = await Survey_R.create({survey_id: 3, version: 1, email: "michelle.li@army.mil", results: {"1": "Rachel", "2": 2, "3": 1, "4": 3, "5": 2, "6": 2, "7": 1, "8": 3}, timestamp: "2024-05-16T17:20:20.000Z"})
  const fms20 = await Survey_R.create({survey_id: 3, version: 1, email: "stephanie.chang@army.mil", results: {"1": "Travis", "2": 2, "3": 3, "4": 2, "5": 2, "6": 2, "7": 3, "8": 2}, timestamp: "2024-08-15T12:12:12.000Z"})
  const fms21 = await Survey_R.create({survey_id: 3, version: 1, email: "jason.chen@army.mil", results: {"1": "Ursula", "2": 2, "3": 2, "4": 3, "5": 2, "6": 2, "7": 2, "8": 3}, timestamp: "2024-09-10T14:40:40.000Z"})
  const fms22 = await Survey_R.create({survey_id: 3, version: 1, email: "rachel.liu@army.mil", results: {"1": "Victor", "2": 3, "3": 2, "4": 1, "5": 3, "6": 2, "7": 3, "8": 0}, timestamp: "2024-10-30T11:11:11.000Z"})
  const fms23 = await Survey_R.create({survey_id: 3, version: 1, email: "eric.wang@army.mil", results: {"1": "Wendy", "2": 0, "3": 1, "4": 2, "5": 3, "6": 2, "7": 1, "8": 2}, timestamp: "2024-10-30T13:13:13.000Z"})
  const fms24 = await Survey_R.create({survey_id: 3, version: 1, email: "catherine.zhang@army.mil", results: {"1": "Xavier", "2": 2, "3": 3, "4": 0, "5": 2, "6": 3, "7": 1, "8": 3}, timestamp: "2024-11-02T00:14:38.000Z"})
  const fms25 = await Survey_R.create({survey_id: 3, version: 1, email: "justin.chen@army.mil", results: {"1": "Yasmine", "2": 1, "3": 0, "4": 3, "5": 2, "6": 1, "7": 3, "8": 2}, timestamp: "2024-12-31T23:59:59.000Z"})
  const fms26 = await Survey_R.create({survey_id: 3, version: 1, email: "grace.wu@army.mil", results: {"1": "Zachary", "2": 3, "3": 2, "4": 1, "5": 3, "6": 2, "7": 2, "8": 2}, timestamp: "2024-12-31T23:59:59.000Z"})
  const fms27 = await Survey_R.create({survey_id: 3, version: 1, email: "steven.liu@army.mil", results: {"1": "Alex", "2": 2, "3": 3, "4": 2, "5": 2, "6": 2, "7": 3, "8": 2}, timestamp: "2024-12-31T23:59:59.000Z"})  

  const core_res   = await Core_Result.create({user_email: "jimmy.mcgill@army.mil", h2f_results: {"Sleep": 100, "Mental": 100, "Physical": 100, "Nutrition": 100, "Spiritual": 100}, cpa_results: {"Ability": 33, "Current": 32, "Motivation": 34}, h2f_flag: "PASSED", cpa_flag: "PASSED", fms_flag: "MFT" })
  const core_res1  = await Core_Result.create({user_email: "jill.shawn@army.mil", h2f_results:{"Sleep": 80, "Mental": 40, "Physical": 75, "Nutrition": 57.14, "Spiritual": 40}, cpa_results: {"Ability": 38, "Current": 33, "Motivation": 38}, h2f_flag: "Sleep-Mental-Physical-Nutrition-Spiritual", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res2  = await Core_Result.create({user_email: "joe.johnson@army.mil", h2f_results:	{"Sleep": 80, "Mental": 40, "Physical": 87.5, "Nutrition": 57.14, "Spiritual": 40}, cpa_results: {"Ability": 31, "Current": 35, "Motivation": 33}, h2f_flag: "Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "PT" })
  const core_res3  = await Core_Result.create({user_email: "adam.smith@army.mil", h2f_results: {"Sleep": 100, "Mental": 40, "Physical": 62.5, "Nutrition": 28.57, "Spiritual": 40}, cpa_results: {"Ability": 36, "Current": 33, "Motivation": 35}, h2f_flag: "Sleep-Physical-Nutrition-Spiritual", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res4  = await Core_Result.create({user_email: "john.don@army.mil", h2f_results: {"Sleep": 100, "Mental": 100, "Physical": 100, "Nutrition": 100, "Spiritual": 100}, cpa_results: {"Ability": 35, "Current": 33, "Motivation": 32}, h2f_flag: "Nutrition", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res5  = await Core_Result.create({user_email: "jane.jackson@army.mil", h2f_results: 	{"Sleep": 60, "Mental": 80, "Physical": 37.5, "Nutrition": 71.43, "Spiritual": 80}, cpa_results: {"Ability": 28, "Current": 37, "Motivation": 34}, h2f_flag: "Sleep-Mental-Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "PT" })
  const core_res6  = await Core_Result.create({user_email: "mike.smith@army.mil", h2f_results:{"Sleep": 80, "Mental": 40, "Physical": 37.5, "Nutrition": 71.43, "Spiritual": 40}, cpa_results: {"Ability": 33, "Current": 34, "Motivation": 31}, h2f_flag: "Mental-Spiritual", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res7  = await Core_Result.create({user_email: "emily.jones@army.mil", h2f_results: {"Sleep": 100, "Mental": 60, "Physical": 12.5, "Nutrition": 0, "Spiritual": 40}, cpa_results: {"Ability": 37, "Current": 33, "Motivation": 35}, h2f_flag: "Nutrition", cpa_flag: "PASSED", fms_flag: "PT" })
  const core_res8  = await Core_Result.create({user_email: "david.brown@army.mil", h2f_results: {"Sleep": 20, "Mental": 20, "Physical": 25, "Nutrition": 14.29, "Spiritual": 40}, cpa_results: {"Ability": 35, "Current": 33, "Motivation": 35}, h2f_flag: "Mental-Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "MFT" })//
  const core_res10 = await Core_Result.create({user_email: "mark.taylor@army.mil", h2f_results: {"Sleep": 40, "Mental": 40, "Physical": 50, "Nutrition": 57.14, "Spiritual": 20}, cpa_results: {"Ability": 32, "Current": 35, "Motivation": 33}, h2f_flag: "Mental", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res11 = await Core_Result.create({user_email: "karen.anderson@army.mil", h2f_results: {"Sleep": 80, "Mental": 60, "Physical": 75, "Nutrition": 85.71, "Spiritual": 80}, cpa_results: {"Ability": 35, "Current": 37, "Motivation": 34}, h2f_flag: "Nutrition", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res12 = await Core_Result.create({user_email: "chris.lee@army.mil", h2f_results:{"Sleep": 60, "Mental": 0, "Physical": 50, "Nutrition": 57.14, "Spiritual": 60}, cpa_results: {"Ability": 37, "Current": 30, "Motivation": 34}, h2f_flag: "Mental-Physical-Nutrition-Spiritual", cpa_flag: "PASSED", fms_flag: "MFT" })//
  const core_res13 = await Core_Result.create({user_email: "lisa.kim@army.mil", h2f_results: 	{"Sleep": 60, "Mental": 100, "Physical": 62.5, "Nutrition": 57.14, "Spiritual": 60}, cpa_results: {"Ability": 35, "Current": 33, "Motivation": 35}, h2f_flag: "Sleep-Mental-Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "PT" })
  const core_res14 = await Core_Result.create({user_email: "brian.chen@army.mil", h2f_results: {"Sleep": 80, "Mental": 20, "Physical": 37.5, "Nutrition": 28.57, "Spiritual": 40}, cpa_results: {"Ability": 35, "Current": 28, "Motivation": 35}, h2f_flag: "Mental", cpa_flag: "PASSED", fms_flag: "PASSED" })
  const core_res15 = await Core_Result.create({user_email: "jessica.wang@army.mil", h2f_results: {"Sleep": 40, "Mental": 40, "Physical": 25, "Nutrition": 71.43, "Spiritual": 20}, cpa_results: {"Ability": 35, "Current": 37, "Motivation": 35}, h2f_flag: "Nutrition-Spiritual", cpa_flag: "PASSED", fms_flag: "MFTT" })//
  const core_res16 = await Core_Result.create({user_email: "kevin.zhang@army.mil", h2f_results: {"Sleep": 20, "Mental": 40, "Physical": 75, "Nutrition": 57.14, "Spiritual": 60}, cpa_results: {"Ability": 33, "Current": 34, "Motivation": 35}, h2f_flag: "Mental-Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "PT" })
  const core_res17 = await Core_Result.create({user_email: "michelle.li@army.mil", h2f_results: 	{"Sleep": 80, "Mental": 60, "Physical": 50, "Nutrition": 28.57, "Spiritual": 60}, cpa_results: {"Ability": 37, "Current": 35, "Motivation": 33}, h2f_flag: "Sleep-Mental-Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "MFT" })
  const core_res19 = await Core_Result.create({user_email: "stephanie.chang@army.mil", h2f_results: 	{"Sleep": 80, "Mental": 80, "Physical": 50, "Nutrition": 42.86, "Spiritual": 40}, cpa_results: {"Ability": 24, "Current": 23, "Motivation": 22}, h2f_flag: "Physical-Nutrition-Spiritual", cpa_flag: "BH", fms_flag: "PASSED" })
  const core_res20 = await Core_Result.create({user_email: "jason.chen@army.mil", h2f_results: 	{"Sleep": 80, "Mental": 60, "Physical": 50, "Nutrition": 57.14, "Spiritual": 20}, cpa_results: {"Ability": 23, "Current": 23, "Motivation": 22}, h2f_flag: "Sleep-Mental", cpa_flag: "BH", fms_flag: "PASSED" })
  const core_res21 = await Core_Result.create({user_email: "rachel.liu@army.mil", h2f_results: {"Sleep": 80, "Mental": 60, "Physical": 75, "Nutrition": 71.43, "Spiritual": 0}, cpa_results: {"Ability": 22, "Current": 24, "Motivation": 23}, h2f_flag: "Mental-Physical-Spiritual", cpa_flag: "BH", fms_flag: "PT" })
  const core_res22 = await Core_Result.create({user_email: "eric.wang@army.mil", h2f_results:{"Sleep": 40, "Mental": 80, "Physical": 87.5, "Nutrition": 100, "Spiritual": 40}, cpa_results: {"Ability": 21, "Current": 23, "Motivation": 23}, h2f_flag: "Sleep-Physical-Nutrition-Spiritual", cpa_flag: "BH", fms_flag: "PT" })
  const core_res23 = await Core_Result.create({user_email: "catherine.zhang@army.mil", h2f_results: 	{"Sleep": 80, "Mental": 20, "Physical": 50, "Nutrition": 57.14, "Spiritual": 40}, cpa_results: {"Ability": 24, "Current": 22, "Motivation": 23}, h2f_flag: "Mental-Nutrition", cpa_flag: "BH", fms_flag: "PT" })
  const core_res24 = await Core_Result.create({user_email: "justin.chen@army.mil", h2f_results: {"Sleep": 0, "Mental": 0, "Physical": 0, "Nutrition": 0, "Spiritual": 0}, cpa_results: {"Ability": 23, "Current": 22, "Motivation": 24}, h2f_flag: "Sleep-Spiritual", cpa_flag: "BH", fms_flag: "PT" })
  const core_res25 = await Core_Result.create({user_email: "grace.wu@army.mil", h2f_results: 	{"Sleep": 100, "Mental": 40, "Physical": 37.5, "Nutrition": 85.71, "Spiritual": 60}, cpa_results: {"Ability": 22, "Current": 24, "Motivation": 22}, h2f_flag: "Mental-Physical-Spiritual", cpa_flag: "BH", fms_flag: "MFTT" })
  const core_res26 = await Core_Result.create({user_email: "steven.liu@army.mil", h2f_results: 	{"Sleep": 60, "Mental": 40, "Physical": 25, "Nutrition": 57.14, "Spiritual": 20}, cpa_results: {"Ability": 33, "Current": 33, "Motivation": 32}, h2f_flag: "Sleep-Physical-Nutrition", cpa_flag: "PASSED", fms_flag: "PASSED" })

  // unit 1st notifications
  const u1notification1 = await Notification.create({unit: "1st", core_assessment_id: 1, core_category: "Physical", description: "(UNIT 1st) You have scores significantly lower than your peers in the Physical domain of the assessment specified above. Please contact your unit's physical therapist to schedule a consultation."})
  const u1notification2 = await Notification.create({unit: "1st", core_assessment_id: 1, core_category: "Nutrition",description: "(UNIT 1st) You have scores significantly lower than your peers in the Nutrition domain of the assessment specified above. Please contact your unit's nutritionist to schedule a consultation."})
  const u1notification3 = await Notification.create({unit: "1st", core_assessment_id: 1, core_category: "Spiritual",description: "(UNIT 1st) You have scores significantly lower than your peers in the Spiritual domain of the assessment specified above. Please contact your unit's Spiritul Specialist to schedule a consultation."})
  const u1notification4 = await Notification.create({unit: "1st", core_assessment_id: 1, core_category: "Mental",description: "(UNIT 1st) You have scores significantly lower than your peers in the Mental domain of the assessment specified above. Please contact your unit's mental health specialist to schedule a consultation."})
  const u1notification5 = await Notification.create({unit: "1st", core_assessment_id: 1, core_category: "Sleep",description: "(UNIT 1st) You have scores significantly lower than your peers in the Sleep domain of the assessment specified above. Please contact your unit's sleep specialist to schedule a consultation."})

  const u1notification6 = await Notification.create({unit: "1st", core_assessment_id: 2, core_category: "Motivation",description: "(UNIT 1st) You have scores significantly lower than your peers in the Motivation domain of the assessment specified above. Please contact your unit's behavior therapist.", resource_email: "John.Smith@army.mil"})
  const u1notification7 = await Notification.create({unit: "1st", core_assessment_id: 2, core_category: "Ability",description: "(UNIT 1st) You have scores significantly lower than your peers in the Ability domain of the assessment specified above. Please contact your unit's behavior therapist."})
  const u1notification8 = await Notification.create({unit: "1st", core_assessment_id: 2, core_category: "Current",description: "(UNIT 1st) You have scores significantly lower than your peers in the Current domain of the assessment specified above. Please contact your unit's behavior therapist."})

  const u1notification9 = await Notification.create({unit: "1st", core_assessment_id: 3,  core_category: "PT", description: "(UNIT 1st) You have scored a 0 on a specific exercise within the assessment specified above. Please contact your unit's physical therapist to schedule a consultation.", resource_email: "John.Smith@army.mil", resource_phone: "555-555-5555"})
  const u1notification10 = await Notification.create({unit:"1st", core_assessment_id: 3, core_category: "MFT", description: "(UNIT 1st) You have scored a 1 on a specific exercise within the assessment specified above. Please contact your unit's master fitness trainer to schedule a consultation.", resource_email: "Jane.Doe@army.mil", resource_phone: "333-333-3333" })

  // unit 2nd notifications
  const u2notification1 = await Notification.create({unit: "2nd", core_assessment_id: 1, core_category: "Physical", description: "(UNIT 2nd) You have scores significantly lower than your peers in the Physical domain of the assessment specified above. Please contact your unit's physical therapist to schedule a consultation."})
  const u2notification2 = await Notification.create({unit: "2nd", core_assessment_id: 1, core_category: "Nutrition",description: "(UNIT 2nd) You have scores significantly lower than your peers in the Nutrition domain of the assessment specified above. Please contact your unit's nutritionist to schedule a consultation."})
  const u2notification3 = await Notification.create({unit: "2nd", core_assessment_id: 1, core_category: "Spiritual",description: "(UNIT 2nd) You have scores significantly lower than your peers in the Spiritual domain of the assessment specified above. Please contact your unit's Spiritul Specialist to schedule a consultation."})
  const u2notification4 = await Notification.create({unit: "2nd", core_assessment_id: 1, core_category: "Mental",description: "(UNIT 2nd) You have scores significantly lower than your peers in the Mental domain of the assessment specified above. Please contact your unit's mental health specialist to schedule a consultation."})
  const u2notification5 = await Notification.create({unit: "2nd", core_assessment_id: 1, core_category: "Sleep",description: "(UNIT 2nd) You have scores significantly lower than your peers in the Sleep domain of the assessment specified above. Please contact your unit's sleep specialist to schedule a consultation."})

  const u2notification6 = await Notification.create({unit: "2nd", core_assessment_id: 2, core_category: "Motivation",description: "(UNIT 2nd) You have scores significantly lower than your peers in the Motivation domain of the assessment specified above. Please contact your unit's behavior therapist.", resource_email: "John.Smith@army.mil"})
  const u2notification7 = await Notification.create({unit: "2nd", core_assessment_id: 2, core_category: "Ability",description: "(UNIT 2nd) You have scores significantly lower than your peers in the Ability domain of the assessment specified above. Please contact your unit's behavior therapist."})
  const u2notification8 = await Notification.create({unit: "2nd", core_assessment_id: 2, core_category: "Current",description: "(UNIT 2nd) You have scores significantly lower than your peers in the Current domain of the assessment specified above. Please contact your unit's behavior therapist."})

  const u2notification9 = await Notification.create({unit:  "2nd", core_assessment_id: 3,  core_category: "PT", description: "(UNIT 2nd) You have scored a 0 on a specific exercise within the assessment specified above. Please contact your unit's physical therapist to schedule a consultation.", resource_email: "John.Smith@army.mil", resource_phone: "555-555-5555"})
  const u2notification10 = await Notification.create({unit: "2nd", core_assessment_id: 3, core_category: "MFT", description: "(UNIT 2nd) You have scored a 1 on a specific exercise within the assessment specified above. Please contact your unit's master fitness trainer to schedule a consultation.", resource_email: "Jane.Doe@army.mil", resource_phone: "333-333-3333" })
 
  // unit 3rd notifications
  const u3notification1 = await Notification.create({unit: "3rd", core_assessment_id: 1, core_category: "Physical", description: "(UNIT 3rd) You have scores significantly lower than your peers in the Physical domain of the assessment specified above. Please contact your unit's physical therapist to schedule a consultation.", resource_email: "jacob.taylor@army.mil"})
  const u3notification2 = await Notification.create({unit: "3rd", core_assessment_id: 1, core_category: "Nutrition",description: "(UNIT 3rd) You have scores significantly lower than your peers in the Nutrition domain of the assessment specified above. Please contact your unit's nutritionist to schedule a consultation.", resource_email: "mary.anya@army.mil"})
  const u3notification3 = await Notification.create({unit: "3rd", core_assessment_id: 1, core_category: "Spiritual",description: "(UNIT 3rd) You have scores significantly lower than your peers in the Spiritual domain of the assessment specified above. Please contact your unit's Spiritul Specialist to schedule a consultation.", resource_email: "jacob.taylor@army.mil"})
  const u3notification4 = await Notification.create({unit: "3rd", core_assessment_id: 1, core_category: "Mental",description: "(UNIT 3rd) You have scores significantly lower than your peers in the Mental domain of the assessment specified above. Please contact your unit's mental health specialist to schedule a consultation."})
  const u3notification5 = await Notification.create({unit: "3rd", core_assessment_id: 1, core_category: "Sleep",description: "(UNIT 3rd) You have scores significantly lower than your peers in the Sleep domain of the assessment specified above. Please contact your unit's sleep specialist to schedule a consultation."})

  const u3notification6 = await Notification.create({unit: "3rd", core_assessment_id: 2, core_category: "Motivation",description: "(UNIT 3rd) You have scores significantly lower than your peers in the Motivation domain of the assessment specified above. Please contact your unit's your unit's behavior therapist.", resource_email: "jane.mallory@army.mil"})
  const u3notification7 = await Notification.create({unit: "3rd", core_assessment_id: 2, core_category: "Ability",description: "(UNIT 3rd) You have scores significantly lower than your peers in the Ability domain of the assessment specified above. Please contact your unit's behavior therapist."})
  const u3notification8 = await Notification.create({unit: "3rd", core_assessment_id: 2, core_category: "Current",description: "(UNIT 3rd) You have scores significantly lower than your peers in the Current domain of the assessment specified above. Please contact your unit's behavior therapist.", resource_email:"tom.brady@army.mil"})

  const u3notification9 = await Notification.create({unit: "3rd", core_assessment_id: 3,  core_category: "PT", description: "(UNIT 3rd) You have scored a 0 on a specific exercise within the assessment specified above. Please contact your unit's physical therapist", resource_email: "tom.walkins@army.mil", resource_phone: "555-555-5555"})
  const u3notification10 = await Notification.create({unit: "3rd", core_assessment_id: 3, core_category: "MFT", description: "(UNIT 3rd) You have scored a 1 on a specific exercise within the assessment specified above. Please contact your unit's master fitness trainer", resource_email: "larry.fitz@army.mil", resource_phone: "333-333-3333" })


  // unit 4th notifications
  const u4notification1 = await Notification.create({unit: "4th", core_assessment_id: 1, core_category: "Physical", description: "(UNIT 4th) You have scores significantly lower than your peers in the Physical domain of the assessment specified above. Please contact your unit's physical therapist to schedule a consultation.", resource_email: "sebastion.gary@army.mil"})
  const u4notification2 = await Notification.create({unit: "4th", core_assessment_id: 1, core_category: "Nutrition",description: "(UNIT 4th) You have scores significantly lower than your peers in the Nutrition domain of the assessment specified above. Please contact your unit's nutritionist to schedule a consultation."})
  const u4notification3 = await Notification.create({unit: "4th", core_assessment_id: 1, core_category: "Spiritual",description: "(UNIT 4th) You have scores significantly lower than your peers in the Spiritual domain of the assessment specified above. Please contact your unit's Spiritul Specialist to schedule a consultation.",resource_email: "kelly.oppa@army.mil"})
  const u4notification4 = await Notification.create({unit: "4th", core_assessment_id: 1, core_category: "Mental",description: "(UNIT 4th) You have scores significantly lower than your peers in the Mental domain of the assessment specified above. Please contact your unit's mental health specialist to schedule a consultation.",resource_email: "william.mar@army.mil"})
  const u4notification5 = await Notification.create({unit: "4th", core_assessment_id: 1, core_category: "Sleep",description: "(UNIT 4th) You have scores significantly lower than your peers in the Sleep domain of the assessment specified above. Please contact your unit's sleep specialist to schedule a consultation."})

  const u4notification6 = await Notification.create({unit: "4th", core_assessment_id: 2, core_category: "Motivation",description: "(UNIT 4th) You have scores significantly lower than your peers in the Motivation domain of the assessment specified above. Please contact your unit's behavior therapist.", resource_email: "vincent.johnny@army.mil"})
  const u4notification7 = await Notification.create({unit: "4th", core_assessment_id: 2, core_category: "Ability",description: "(UNIT 4th) You have scores significantly lower than your peers in the Ability domain of the assessment specified above. Please contact your unit's behavior therapist.", resource_email: "simon.riley@army.mil", resource_phone: "555-555-5555"})
  const u4notification8 = await Notification.create({unit: "4th", core_assessment_id: 2, core_category: "Current",description: "(UNIT 4th) You have scores significantly lower than your peers in the Current domain of the assessment specified above. Please contact your unit's behavior therapist."})

  const u4notification9 = await Notification.create({unit: "4th", core_assessment_id: 3,  core_category: "PT", description: "(UNIT 4th) You have scored a 0 on a specific exercise within the assessment specified above. Please contact your unit's physical to schedule a consultation.",resource_email: "weah.quesmar@army.mil", resource_phone: "555-555-5555"})
  const u4notification10 = await Notification.create({unit: "4th", core_assessment_id: 3, core_category: "MFT", description: "(UNIT 4th) You have scored a 1 on a specific exercise within the assessment specified above. Please contact your unit's master fitness trainer", resource_email: "james.erwin@army.mil" })
  
  // unit 5th notifications
  const u5notification1 = await Notification.create({unit: "5th", core_assessment_id: 1, core_category: "Physical", description: "(UNIT 5th) You have scores significantly lower than your peers in the Physical domain of the assessment specified above. Please contact your unit's physical therapist to schedule a consultation.", resource_email: "floyd.mcgregor@army.mil"})
  const u5notification2 = await Notification.create({unit: "5th", core_assessment_id: 1, core_category: "Nutrition",description: "(UNIT 5th) You have scores significantly lower than your peers in the Nutrition domain of the assessment specified above. Please contact your unit's nutritionist to schedule a consultation."})
  const u5notification3 = await Notification.create({unit: "5th", core_assessment_id: 1, core_category: "Spiritual",description: "(UNIT 5th) You have scores significantly lower than your peers in the Spiritual domain of the assessment specified above. Please contact your unit's Spiritul Specialist to schedule a consultation.", resource_email: "tim.murphey@army.mil"})
  const u5notification4 = await Notification.create({unit: "5th", core_assessment_id: 1, core_category: "Mental",description: "(UNIT 5th) You have scores significantly lower than your peers in the Mental domain of the assessment specified above. Please contact your unit's mental health specialist to schedule a consultation."})
  const u5notification5 = await Notification.create({unit: "5th", core_assessment_id: 1, core_category: "Sleep",description: "(UNIT 5th) You have scores significantly lower than your peers in the Sleep domain of the assessment specified above. Please contact your unit's sleep specialist to schedule a consultation.", resource_email: "tim.murphey@army.mil"})

  const u5notification6 = await Notification.create({unit: "5th", core_assessment_id: 2, core_category: "Motivation",description: "(UNIT 5th) You have scores significantly lower than your peers in the Motivation domain of the assessment specified above. Please contactyour unit's behavior therapist."})
  const u5notification7 = await Notification.create({unit: "5th", core_assessment_id: 2, core_category: "Ability",description: "(UNIT 5th) You have scores significantly lower than your peers in the Ability domain of the assessment specified above. Please contact your unit's behavior therapist.", resource_email: "thomas.rigby@army.mil"})
  const u5notification8 = await Notification.create({unit: "5th", core_assessment_id: 2, core_category: "Current",description: "(UNIT 5th) You have scores significantly lower than your peers in the Current domain of the assessment specified above. Please contact your unit's behavior therapist.", resource_email: "henry.jackson@army.mil"})

  const u5notification9 = await Notification.create({unit: "5th", core_assessment_id: 3,  core_category: "PT", description: "(UNIT 5th) You have scored a 0 on a specific exercise within the assessment specified above. Please contact your unit's physical therapist", resource_email: "aleksi.donahue@army.mil", resource_phone: "555-555-5555"})
  const u5notification10 = await Notification.create({unit: "5th", core_assessment_id: 3, core_category: "MFT", description: "(UNIT 5th) You have scored a 1 on a specific exercise within the assessment specified above. Please contact your unit's master fitness trainer", resource_email: "eric.wong@army.mil", resource_phone: "333-333-3333" })
  

  console.log("Data Entered")
}


sequelize.sync({ force: true, alter: true }).then(() => {
  console.log("Database synced")
  setup().then(() => console.log("Setup completed"))
})

module.exports = app;
