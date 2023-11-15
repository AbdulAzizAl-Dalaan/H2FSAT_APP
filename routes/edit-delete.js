var express = require("express");
var router = express.Router();
const User = require("../models/User");
const Survey_Info = require("../models/Survey/Survey_Info");
const Survey_Q = require("../models/Survey/Survey_Q");
const Survey_A = require("../models/Survey/Survey_A");
const Survey_R = require("../models/Survey/Survey_R");
const Survey_V = require("../models/Survey/Survey_V");
const Survey_D = require("../models/Survey/Survey_D");
const { Op } = require("sequelize");
const { route } = require(".");

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

  if (res.locals.email && res.locals.isAdmin) {
    // PUT ADMIN CHECK BACK IN LATER

    const survey = await Survey_Info.findByPk(req.params.id);
    if (survey) {

      if (survey.isCore && survey.survey_id != 1) {
        res.redirect("/home/?msg=editcore");
        return;
      }

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
                  .filter(
                    (answer) => answer.question_id === question.question_id
                  )
                  .map((answer) => answer.dataValues)
              : [],
        };
      });

      // console.log(questions_data);
      // questions_data.forEach((question) => {
      //   console.log("Question:", question.prompt);
      //   question.answers.forEach((answer) => {
      //     console.log("    Answer:", answer.text);
      //   });
      // });
      if (survey.isCore && survey.survey_id == 1) {
        res.render("h2f-edit", { survey, questions_data });
        
      } else {
        res.render("edit", { survey, questions_data });
      }
    } else {
      res.redirect("home/?msg=notfound");
    }
  } else {
    res.redirect("/home/?msg=noaccess");
  }
});

router.post("/:id", async function (req, res, next) {
  console.log("BODY CONTENTS:");
  console.log(req.body);
  // ADD AN USER ADMIN CHECK HERE
  console.log(req.params.id);

  let passFlag = false;
  let newPassword = null;
  let oldVersionQuestions = {};

  if (res.locals.email && res.locals.isAdmin) {
    // PUT ADMIN CHECK BACK IN LATER
    const survey = await Survey_Info.findByPk(req.params.id);
    if (survey) {
      if (req.body.num_questions == 0) {
        res.redirect("/edit/" + req.params.id + "/?msg=zeroquestions");
        return;
      }

      dubplicateSurvey = await Survey_Info.findAll({where : {title : req.body.title}});
      if (dubplicateSurvey.length > 0 && dubplicateSurvey[0].survey_id != req.params.id) {
        res.redirect("/edit/" + req.params.id + "/?msg=samename");
        return;
      }

      const surveyID = survey.survey_id;

      // console.log(req.body.secure)
      // console.log(req.body.oldPassword)
      // console.log(survey.secure)
      // console.log(req.body.newPassword)
      // console.log(req.body.confirmNewPassword)

      // NOT FULLY COMPLETED YET
      if (req.body.secure !== undefined) {
        //  user has changed change password or added one
        if (
          req.body.secure === "on" &&
          req.body.oldPassword !== undefined &&
          survey.secure === true &&
          req.body.oldPassword === survey.password &&
          req.body.newPassword !== undefined &&
          req.body.newPassword === req.body.confirmNewPassword
        ) {
          passFlag = true;
        } else if (
          req.body.secure !== undefined &&
          req.body.secure === "on" &&
          req.body.newPassword !== undefined &&
          survey.secure === false &&
          req.body.newPassword === req.body.confirmNewPassword
        ) {
          passFlag = true;
        } else {
          res.redirect("/edit/" + req.params.id + "/?msg=editpass");
          return;
        }
      } else {
        passFlag = true;
      }

      await Survey_R.update(
        { isOutdated: true },
        { where: { survey_id: survey.survey_id } }
      );

      const questions = await Survey_Q.findAll({ where: { survey_id: surveyID } });

      for (let i = 0; i < questions.length; i++) {
        oldVersionQuestions[questions[i].question_id] = questions[i].prompt;
      }

      await Survey_V.create({ survey_id: surveyID, version: survey.version, questions: oldVersionQuestions });

      await Survey_A.destroy({ where: { survey_id: survey.survey_id } });

      await Survey_Q.destroy({ where: { survey_id: survey.survey_id } });

      await Survey_Info.update(
        {
          title: req.body.title,
          author: req.session.user.email,
          description: req.body.description,
          version: survey.version + 1,
          secure: req.body.secure === "on" ? true : false,
          password: req.body.secure === "on" ? req.body.newPassword : null,
        },
        { where: { survey_id: survey.survey_id } }
      );

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
        if (
          question.type === "checkbox" ||
          question.type === "multiple_choice"
        ) {
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
      res.redirect("/home/?msg=editsuccess");
    } else {
      res.redirect("/home/?msg=notfound");
    }
  } else {
    res.redirect("/home/?msg=noaccess");
  }
});

router.post("/h2f/knowledgecheck", async function (req, res, next) {
  console.log("BODY CONTENTS:");
  console.log(req.body);

  res.redirect("/home/?msg=editsuccess");

});


// Might need to go back later for Survey_D Instances deletions
router.post("/delete/:id", async function (req, res, next) {
  console.log(res.locals.email);
  console.log(res.locals.isAdmin);

  if (res.locals.email && res.locals.isAdmin) {
    const survey = await Survey_Info.findByPk(req.params.id);
    if (survey) {
      if (!survey.isCore) {

      await Survey_D.destroy({ where: { survey_id: survey.survey_id } });

      await Survey_V.destroy({ where: { survey_id: survey.survey_id } });

      await Survey_R.destroy({ where: { survey_id: survey.survey_id } });

      await Survey_A.destroy({ where: { survey_id: survey.survey_id } });

      await Survey_Q.destroy({ where: { survey_id: survey.survey_id } });

      await survey.destroy();

      res.redirect("/home/?msg=delete");
      } else {
        res.redirect("/home/?msg=delcore");
      }
    } else {
      res.redirect("/home/?msg=notfound");
    }
  } else {
    res.redirect("/home/?msg=noaccess");
  }
});

module.exports = router;
