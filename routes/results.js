var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const User = require("../models/User");
const Survey_Info = require("../models/Survey/Survey_Info");
const Survey_Q = require("../models/Survey/Survey_Q");
const Survey_A = require("../models/Survey/Survey_A");
const Survey_R = require("../models/Survey/Survey_R");
const Survey_D = require("../models/Survey/Survey_D");
const Survey_V = require("../models/Survey/Survey_V");
const Core_Result = require("../models/Core_Result"); 

const sessionChecker = (req, res, next) => {
  if (req.session.user) {
    res.locals.firstname = req.session.user.firstname;
    res.locals.lastname = req.session.user.lastname;
    res.locals.unit = req.session.user.unit;
    res.locals.rank = req.session.user.rank;
    res.locals.email = req.session.user.email;
    res.locals.state = req.session.user.state;
    res.locals.isAdmin = req.session.user.isAdmin;
    res.locals.isUnitLeader = req.session.user.isUnitLeader;
    next();
  } else {
    res.redirect("/?msg=raf");
  }
};

router.use(sessionChecker);

router.get("/", async function (req, res, next) {
  if (req.query.msg) {
    res.locals.msg = req.query.msg;
  }
  // find all the survey ids which have results
  const surveys = await Survey_Info.findAll()
  res.render('results', {surveys})

});

router.get('/:id', async function (req, res, next) {
  if (req.query.msg) {
    res.locals.msg = req.query.msg;
  }

  const survey = await Survey_Info.findOne({ where: { survey_id: req.params.id } });

  // Initialize variables to hold survey results
  let surveyResultsR = [];
  let surveyResultsD = [];

  let userEmailsInUnit = [];
if (res.locals.isUnitLeader) {
  const usersInUnit = await User.findAll({
    where: { 
      unit: res.locals.unit 
    },
    attributes: ['email'] // Fetch only the email attribute
  });

  userEmailsInUnit = usersInUnit.map(user => user.email);
}
if (res.locals.isAdmin) {
  // If user is an admin, fetch all results
  surveyResultsR = await Survey_R.findAll({ where: { survey_id: req.params.id } });
  surveyResultsD = await Survey_D.findAll({ where: { survey_id: req.params.id } });
} else if (res.locals.isUnitLeader && userEmailsInUnit.length > 0) {
  // If user is a unit leader, fetch results filtered by their unit
  surveyResultsR = await Survey_R.findAll({
    where: {
      survey_id: req.params.id,
      email: userEmailsInUnit // Use the list of emails to filter
    }
  });
  surveyResultsD = await Survey_D.findAll({
    where: {
      survey_id: req.params.id,
      email: userEmailsInUnit // Use the list of emails to filter for Survey_D as well
    }
  });
}

let core_results = [];

if (res.locals.isAdmin) {
    // If user is an admin, fetch all core results
    core_results = await Core_Result.findAll();
} else if (res.locals.isUnitLeader && userEmailsInUnit.length > 0) {
    // If user is a unit leader, fetch core results filtered by their unit
    core_results = await Core_Result.findAll({
        where: {
            user_email: userEmailsInUnit // Filter by user_email
        }
    });
}


  // Process and combine the results
  const surveyResultsRPlain = surveyResultsR.map(result => result.toJSON());
  const surveyResultsDPlain = surveyResultsD.map(result => result.toJSON());
  const survey_results = [...surveyResultsRPlain, ...surveyResultsDPlain];

  // Fetch other required data
  const survey_questions = await Survey_Q.findAll({ where: { survey_id: req.params.id } });
  //const core_results = await Core_Result.findAll();
  const version_results = await Survey_V.findAll({ where: { survey_id: req.params.id } });
  const user_results = await User.findAll({ attributes: ['unit', 'state', 'rank', 'email', 'dob', 'gender'] });
  const unit_results = await User.findAll();

  res.render("results_survey", {survey, survey_results, survey_questions, core_results, version_results, user_results, unit_results});
});

// Endpoint to handle deletion of a survey result
router.post('/delete-entry', async function(req, res) {
  try {
      const { email, survey_id } = req.body;
      console.log(`Received deletion request for email: ${email} and survey_id: ${survey_id}`);

      // Delete from Survey_R
      const surveyResult = await Survey_R.destroy({ 
          where: { 
              email: email, 
              survey_id: survey_id
          } 
      });

      const surveyDResult = await Survey_D.destroy({ 
        where: { 
            email: email, 
            survey_id: survey_id
        } 
    });
      console.log(`Survey_R Deletion result: ${surveyResult}`);

      // If survey_id is 1, 2, or 3, also delete from Core_Result
      if ([1, 2, 3].includes(survey_id)) {
          const coreResult = await Core_Result.destroy({ 
              where: { 
                  user_email: email 
              }
          });
          console.log(`Core_Result Deletion result: ${coreResult}`);
      }

      res.json({ status: 'success', message: 'Entry deleted successfully' });
  } catch (error) {
      console.error("Deletion error:", error);
      res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
});



module.exports = router;
