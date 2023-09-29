var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const User = require("../models/User");
const Survey_Info = require("../models/Survey/Survey_Info");
const Survey_Q = require("../models/Survey/Survey_Q");
const Survey_A = require("../models/Survey/Survey_A");
const Survey_R = require("../models/Survey/Survey_R");

const sessionChecker = (req, res, next) => {
  if (req.session.user) {
    res.locals.firstname = req.session.user.firstname;
    res.locals.lastname = req.session.user.lastname;
    res.locals.unit = req.session.user.unit;
    res.locals.rank = req.session.user.rank;
    res.locals.email = req.session.user.email;
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
  const survey_results = await Survey_R.findAll();
  const surveys_results_with_name = await Survey_R.findAll({
    Include: [{ model: Survey_Info }],
  });
  console.log(surveys_results_with_name);
  // join the tables on survey_id
  console.log(surveys_results_with_name[0].Survey_Info);

  res.render("results", { survey_results });
});

module.exports = router;
