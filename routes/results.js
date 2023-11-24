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

  const surveyResultsR = await Survey_R.findAll({ where: { survey_id: req.params.id } });
  const surveyResultsD = await Survey_D.findAll({ where: { survey_id: req.params.id } });
  
  // const survey_results = [...surveyResultsR, ...surveyResultsD];
  // console.log('Survey Results:', survey_results);

  const surveyResultsRPlain = surveyResultsR.map(result => result.toJSON());
  const surveyResultsDPlain = surveyResultsD.map(result => result.toJSON());

  const survey_results = [...surveyResultsRPlain, ...surveyResultsDPlain];
  //console.log("Survey results:*****", survey_results);


  const survey_questions = await Survey_Q.findAll({ where: { survey_id: req.params.id } });

  const core_results = await Core_Result.findAll();

  const version_results = await Survey_V.findAll({ where: { survey_id: req.params.id } });

  const user_results = await User.findAll({
    attributes: ['unit', 'state', 'rank', 'email']
});

  
  res.render("results_survey", {survey, survey_results, survey_questions, core_results, version_results, user_results})
  

});

module.exports = router;
