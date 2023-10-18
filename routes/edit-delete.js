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
    res.locals.state = req.session.user.state;
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
      where: { survey_id: survey.survey_id },
    });
    const survey_answers = await Survey_A.findAll({
      where: { survey_id: survey.survey_id },
    });

    let questions_data = survey_questions.map((question) => {
      return {
        ...question.dataValues,
        answers:
          question.type === "multiple_choice" || question.type === "checkbox"
            ? survey_answers
                .filter((answer) => answer.question_id === question.question_id)
                .map((answer) => answer.dataValues)
            : [], 
      };
    });

    console.log(questions_data);
    questions_data.forEach((question) => {
      console.log("Question:", question.prompt);
      question.answers.forEach((answer) => {
        console.log("    Answer:", answer.text);
      });
    });

    if (res.locals.email && res.locals.isAdmin) {
      res.render("edit", { survey, questions_data });
    } else {
      res.redirect("/home/?msg=noaccess");
    }
  } else {
    res.redirect("home/?msg=notfound");
  }
});

router.post("/:id", async function (req, res, next) {
  console.log("BODY CONTENTS:");
  console.log(req.body);
  // ADD AN USER ADMIN CHECK HERE
  console.log(req.params.id)

  if (res.locals.email && res.locals.isAdmin) {
    const survey = await Survey_Info.findByPk(req.params.id);
    if (survey) {
      const surveyID = survey.survey_id

      await Survey_R.destroy({ where: { survey_id: survey.survey_id } });

      await Survey_A.destroy({ where: { survey_id: survey.survey_id } });

      await Survey_Q.destroy({ where: { survey_id: survey.survey_id } });

      await survey.destroy();

      const new_survey = await Survey_Info.create({
        survey_id: surveyID,
        title: req.body.title,
        author: req.session.user.email,
        description: req.body.description,
        secure: req.body.secure === "on" ? true : false,
        password: req.body.secure === "on" ? req.body.password : null,
        grade_by_points: req.body.grade_by_points === "on" ? true : false,
        show_question_numbers:
          req.body.show_question_numbers === "on" ? true : false,
      });
      // ADD CODE TO CREATE SURVEY QUESTIONS AND ANSWERS HERE
      const num_questions = req.body.num_questions;
      for (let i = 1; i <= num_questions; i++) {
        console.log(req.body["question_" + i + "_title"]);
        console.log(req.body["question_" + i + "_type"]);
        const question = await Survey_Q.create({
          survey_id: surveyID,
          question_id: i,
          prompt: req.body["question_" + i + "_title"],
          type: req.body["question_" + i + "_type"],
          top_range: req.body["question_" + i + "_number_range_top"],
          bottom_range: req.body["question_" + i + "_number_range_bottom"],
          point_value: req.body["question_" + i + "_point_value"],
        });
        if (question.type === "checkbox" || question.type === "multiple_choice") {
          let j = 1;
          while (req.body["question_" + i + "_option_" + j] !== undefined) {
            await Survey_A.create({
              survey_id: surveyID,
              question_id: question.question_id,
              answer_id: j,
              text: req.body["question_" + i + "_option_" + j],
            });
            j++;
          }
        }
      }
      res.redirect("/home");
    }
    else {
      res.redirect("/home/?msg=notfound");
    }
  }
  else {
    res.redirect("/home/?msg=noaccess");
  }

  // if (res.locals.email && res.locals.isAdmin) {
  //   res.redirect("home");
  // } else {
  //   res.redirect("/home/?msg=noaccess");
  // }
});

// Might need to go back later for Survey_D Instances deletions
router.post("/delete/:id", async function (req, res, next) {
  console.log(res.locals.email);
  console.log(res.locals.isAdmin);

  if (res.locals.email && res.locals.isAdmin) {
    const survey = await Survey_Info.findByPk(req.params.id);
    if (survey) {
      await Survey_R.destroy({ where: { survey_id: survey.survey_id } });

      await Survey_A.destroy({ where: { survey_id: survey.survey_id } });

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
