var express = require("express");
var router = express.Router();
const User = require("../models/User");
const Survey_Info = require("../models/Survey/Survey_Info");
const Survey_Q = require("../models/Survey/Survey_Q");
const Survey_A = require("../models/Survey/Survey_A");
const Survey_R = require("../models/Survey/Survey_R");
const { Op } = require("sequelize");

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

router.get("/:id", async function (req, res, next) {
  if (req.query.msg) {
    res.locals.msg = req.query.msg;
  }
  const survey = await Survey_Info.findByPk(req.params.id);
  if (survey) {
    const survey_questions = await Survey_Q.findAll({
      where: { survey_id: req.params.id },
    });
    if (res.locals.email && res.locals.isAdmin) {
      res.render("edit", { survey, survey_questions });
    } else {
      res.redirect("/home/?msg=noaccess");
    }
  } else {
    res.redirect("home/?msg=notfound");
  }
});

router.post("/", async function (req, res, next) {
  console.log("BODY CONTENTS:");
  console.log(req.body);
  // ADD AN USER ADMIN CHECK HERE
  console.log(res.locals.email);
  console.log(res.locals.isAdmin);

  if (res.locals.email && res.locals.isAdmin) {
    res.redirect("home");
  } else {
    res.redirect("/home/?msg=noaccess");
  }
});

// Might need to go back later for Survey_D Instances deletions 
router.post("/delete/:id", async function (req, res, next) {
  
  console.log(res.locals.email);
  console.log(res.locals.isAdmin);

  if (res.locals.email && res.locals.isAdmin) {
    const survey = await Survey_Info.findByPk(req.params.id);
    if (survey) {

      await Survey_R.destroy({ where: { survey_id: survey.survey_id } });

      await Survey_A.destroy({ where: { survey_id: survey.survey_id }});

      await Survey_Q.destroy({ where: { survey_id: survey.survey_id } });

      await survey.destroy();

      res.redirect("/home/?msg=delete");
    } else {
      res.redirect("/home/?msg=notfound");
    }
  } else {
    res.redirect("/home/?msg=noaccess");
  }
});

module.exports = router;
