var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const User = require("../models/User");
const Survey_Info = require("../models/Survey/Survey_Info");
const Survey_Q = require("../models/Survey/Survey_Q");
const Survey_A = require("../models/Survey/Survey_A");
const Survey_R = require("../models/Survey/Survey_R");
const Survey_D = require("../models/Survey/Survey_D");

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
  // const survey = await Survey_Info.findAll({where: {survey_id: req.params.id}})
  // const survey_questions = await Survey_Q.findAll({where: {survey_id: req.params.id}})
  // const survey_results = await Survey_R.findAll({where: {survey_id: req.params.id}})

  const survey = await Survey_Info.findOne({ where: { survey_id: req.params.id } });

  const surveyResultsR = await Survey_R.findAll({ where: { survey_id: req.params.id } });
  const surveyResultsD = await Survey_D.findAll({ where: { survey_id: req.params.id } });
  const survey_results = [...surveyResultsR, ...surveyResultsD];
  const surveyQuestions = await Survey_Q.findAll({ where: { survey_id: req.params.id } });
  res.render("results_survey", { survey, survey_results});



  // let survey_results = await Survey_R.findAll({ where: { survey_id: req.params.id } });
  
  // if (survey_results.length === 0) {
  //   survey_results = await Survey_D.findAll({ where: { survey_id: req.params.id } });
  // }

  // const survey_questions = await Survey_Q.findAll({ where: { survey_id: req.params.id } });

  // res.render("results_survey", {survey, survey_results})
});

module.exports = router;
