var express = require('express');
var router = express.Router();
const User = require('../models/User')
const Survey_Info = require('../models/Survey/Survey_Info')
const Survey_Q = require('../models/Survey/Survey_Q')
const Survey_A = require('../models/Survey/Survey_A')
const Survey_R = require('../models/Survey/Survey_R');
const Core_Result = require('../models/Core_Result');
const Notification = require('../models/Notification');

const sessionChecker = (req, res, next) => {
  if(req.session.user)
  {
    res.locals.firstname = req.session.user.firstname
    res.locals.lastname = req.session.user.lastname
    res.locals.unit = req.session.user.unit
    res.locals.rank = req.session.user.rank
    res.locals.email = req.session.user.email
    res.locals.state = req.session.user.state;
    res.locals.isAdmin = req.session.user.isAdmin
    res.locals.isUnitLeader = req.session.user.isUnitLeader
    next()
  }
  else
  {
    res.redirect("/?msg=raf")
  }
}

router.use(sessionChecker)

router.get('/', async function(req, res, next) {
  const surveys = await Survey_Info.findAll({where: {isCSVdata: false}})
  if (req.query.msg)
  {
    res.locals.msg = req.query.msg
  }
  console.log("CURRENT USER:" + req.session.user.email)
  const isAdmin = req.session.user.isAdmin
  let username = req.session.user.email
  // strip out the second half of the email
  let usernameArray = username.split("@")
  username = usernameArray[0].replace(".", "")
  console.log("USER EMAIL: " + username)
  const Notifications = await Notification.findAll({ where: { unit: res.locals.unit } });
  // remove the period from the email
  let category_dict = {};
  for (let i = 0; i < Notifications.length; i++) {
    category_dict[Notifications[i].core_category] = [Notifications[i].description, Notifications[i].resource_email, Notifications[i].resource_phone];
  }
  let User_Result = {}
  if (res.locals.msg === "h2f" || res.locals.msg === "cpa" || res.locals.msg === "fms") {
    User_Result = await Core_Result.findOne({ where: { user_email: res.locals.email } });
  }

  console.log("RES LOCALS UNIT: " + res.locals.unit)
  console.log("RES LOCALS RANK: " + res.locals.rank)
  console.log("RES LOCALS STATE: " + res.locals.state)
  if (res.locals.unit === "None" && res.locals.rank === "None" && res.locals.state === "None") {
    res.redirect("/profile");
  }
  else {
    res.render('home', {surveys, isAdmin, username, User_Result, category_dict});
  }
});

router.get('/:id', async function(req, res, next) {
  console.log("REQ URL: " + req.url)
  const survey = await Survey_Info.findByPk(req.params.id)
  if (survey !== null)
  {
    const results = await Survey_R.findAll({where: {email: req.session.user.email, survey_id: survey.survey_id, version: survey.version}})
    if (results.length === 0)
    {
      const questions = await Survey_Q.findAll({where: {survey_id: survey.survey_id}})
      const answers = await Survey_A.findAll({where: {survey_id: survey.survey_id}})
      res.render('survey', {survey, questions, answers});
    }
    else
    {
      res.redirect('/home/?msg=already')
    }
  }
  else
  {
    res.redirect('/home/?msg=notfound')
  }
  
});

router.post('/:id/submit', async function(req, res, next) {
  if (req.query.msg)
  {
    res.locals.msg = req.query.msg
  }
  const user = await User.findByPk(req.session.user.email);
  if (user !== null)
  {
    const survey = await Survey_Info.findByPk(req.params.id)
    console.log("ID: " + req.params.id)
    console.log("USER: " + user)
    console.log("SURVEY: " + survey)
    const results = await Survey_R.findAll({where: {email: user.email, survey_id: survey.survey_id, version: survey.version}})
    if (results.length === 0)
    {
      let result_dict = {}
      const questions = await Survey_Q.findAll({where: {survey_id: req.params.id}})
        questions.forEach(question => {
          const answer = req.body[question.question_id]
          console.log("ANSWER: " + answer) 
          if (answer !== undefined)
          {
            result_dict[question.question_id] = answer
          }
        });
        console.log("RESULT DICT: " + JSON.stringify(result_dict))
        const result = await Survey_R.create({email: user.email, survey_id: survey.survey_id, version: survey.version, results: result_dict })


        if (survey.isCore) {
          let core_res = null;
          switch (result.survey_id) { // ASSUME THAT THE SURVEY_ID IS EITHER 1 (H2F), 2 (CPA), OR 3 (FMS)
            case 1: // H2F
              const correct_answers = await Survey_A.findAll({where: {survey_id: req.params.id, is_correct: true}}) // get all correct texts only
              let h2f_flag = "PASSED"
              let correct_answers_array = []
              correct_answers.forEach(answer => {
                correct_answers_array[answer.question_id - 1] = answer.text // question_id 1 is index 0
              }
              );
              console.log(correct_answers_array)
              const categories = ["Physical", "Nutrition", "Mental", "Spiritual",  "Sleep"]
              let category_scores = {}
              categories.forEach(category => {
                category_scores[category] = 0
              });

              questions.forEach(question => {
                const answer = result_dict[question.question_id]
                if (answer === correct_answers_array[question.question_id - 1]) {
                  category_scores[question.core_category] += 1
                }
              });

              categories.forEach(category => { // NEED TO CHANGE TO ACCOUNT FOR NUMBER OF QUESTIONS FOR EACH CATEGORY ASSUMING 2 FOR NOW
                const category_questions_num = questions.filter(question => question.core_category === category).length
                console.log("CATEGORY: " + category)
                console.log("CATEGORY QUESTIONS NUM: " + category_questions_num)
                console.log("CATEGORY SCORES: " + category_scores[category])
                console.log("CATEGORY SCORES DIVIDED: " + category_scores[category] / category_questions_num * 100)
                category_scores[category] = Math.round(( (category_scores[category] / category_questions_num * 100) + Number.EPSILON) * 100) / 100;
                if (category_scores[category] < 50 && h2f_flag === "PASSED") {
                  h2f_flag = category
                }
                else if (category_scores[category] < 50) {
                  h2f_flag += "-" + category
                }
              });

              core_res = [category_scores, h2f_flag];
              for (const [key, value] of Object.entries(category_scores)) {
                console.log(`${key}: ${value}`)
              }
              break;
            case 2: // CPA
              const cpa_categories = ["Motivation", "Ability", "Current"]
              let cpa_scores = {}
              cpa_categories.forEach(category => {
                cpa_scores[category] = 0
              });
              let cpa_flag = "PASSED"
              
              questions.forEach(question => {
                const answer = result_dict[question.question_id]
                cpa_scores[question.core_category] += parseInt(answer)
              });

              cpa_categories.forEach(category => {
                if (cpa_scores[category] < 25) {
                  cpa_flag = "BH"
                }
              });
              core_res = [cpa_scores, cpa_flag]
              console.log("core_res in cpa: "+ core_res)
              break;
            case 3: // FMS
              let fms_flag = "PASSED"

              questions.forEach(question => {
                const answer = result_dict[question.question_id]
                if (answer === '0') {
                  fms_flag = "PT"
                }
                else if (answer === '1' && fms_flag !== "PT") {
                  fms_flag = "MFT"
                }
              });
              core_res = fms_flag
              break;  
            default:
              break;
          }

          console.log("CORE RES: " + core_res)
          const survey_core_result = await Core_Result.findByPk(user.email)
          if (survey_core_result === null) {
            switch (result.survey_id) {
              case 1: // H2F
                await Core_Result.create({user_email: user.email, h2f_results: core_res[0], h2f_flag: core_res[1]})
                //res.redirect('/home/?msg=h2f')
                break;
              case 2: // CPA
                await Core_Result.create({user_email: user.email, cpa_results: core_res[0], cpa_flag: core_res[1]})
                //res.redirect('/home/?msg=cpa')
                break;
              case 3: // FMS
                await Core_Result.create({user_email: user.email, fms_flag: core_res})
                //res.redirect('/home/?msg=fms')
                break;
              default:
                break;
            }
          }
          else {
            // only update the results if the user has not taken the survey before
            console.log("SURVEY CORE RESULT: " + survey_core_result)
            switch (result.survey_id) {
              case 1: // H2F
                if (survey_core_result.h2f_results === null) {
                  await survey_core_result.update({h2f_results: core_res[0], h2f_flag: core_res[1]})
                  await survey_core_result.save()
                }
                break;
              case 2: // CPA
                if (survey_core_result.cpa_flag === null && survey_core_result.cpa_results === null) {
                  await survey_core_result.update({cpa_results: core_res[0], cpa_flag: core_res[1]})
                  await survey_core_result.save()
                }
                break;
              case 3: // FMS
                if (survey_core_result.fms_flag === null) {
                  await survey_core_result.update({fms_flag: core_res})
                  await survey_core_result.save()
                }
                break;
              default:
                break;
            }
          }

          console.log("Right before redirect")
          switch (result.survey_id) {
            case 1:
              res.redirect('/home/?msg=h2f')
              break;
            case 2:
              res.redirect('/home/?msg=cpa')
              break;
            case 3:
              res.redirect('/home/?msg=fms')
              break;
            default:
              break;
          }
        }
        else {
          res.redirect('/home/?msg=success')
        }

    }
    else 
    {
      res.redirect('/home/?msg=already')
    }
  }
  else
  {
    res.redirect('/?msg=raf')
  }
});

router.post('/:id/authorize', async function(req, res, next) {
  const survey = await Survey_Info.findByPk(req.params.id)
  if (survey !== null)
  {
    if (req.body.password === survey.password)
    {
      res.redirect('/home/' + req.params.id)
    }
    else
    {
      res.redirect('/home/?msg=wrongpass')
    }
  }
  else
  {
    res.redirect('/home/?msg=notfound')
  }
});

router.get('/unitsummary', async function(req, res, next) {
  res.redirect('unitsummary');
});



module.exports = router;
