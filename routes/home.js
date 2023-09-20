var express = require('express');
var router = express.Router();
const User = require('../models/User')
const Survey_Info = require('../models/Survey/Survey_Info')
const Survey_Q = require('../models/Survey/Survey_Q')
const Survey_A = require('../models/Survey/Survey_A')
const Survey_R = require('../models/Survey/Survey_R');
const e = require('express');
const { map } = require('../app');

const sessionChecker = (req, res, next) => {
  if(req.session.user)
  {
    res.locals.firstname = req.session.user.firstname
    res.locals.lastname = req.session.user.lastname
    res.locals.unit = req.session.user.unit
    res.locals.rank = req.session.user.rank
    res.locals.email = req.session.user.email
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
  const surveys = await Survey_Info.findAll()
  if (req.query.msg)
  {
    res.locals.msg = req.query.msg
  }
  console.log("CURRENT USER:" + req.session.user.email)
  res.render('home', {surveys});
});

router.get('/:id', async function(req, res, next) {
  const survey = await Survey_Info.findByPk(req.params.id)
  if (survey !== null)
  {
    const results = await Survey_R.findAll({where: {email: req.session.user.email, survey_id: survey.survey_id}})
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
    const results = await Survey_R.findAll({where: {email: user.email, survey_id: survey.survey_id}})
    if (results.length === 0)
    {
      let result_dict = {}
      const questions = await Survey_Q.findAll({where: {survey_id: req.params.id}})
      if (survey.grade_by_points)
      {
        let res_score = 0
        const correct_answers = await Survey_A.findAll({where: {survey_id: req.params.id, is_correct: true}}) // get all correct texts only
        const correct_answers_text = correct_answers.map(answer => answer.text)
        questions.forEach(question => {
          const answer = req.body[question.question_id]
          console.log("ANSWER: " + answer) 
          if (answer !== undefined)
          {
            result_dict[question.question_id] = answer
          }
          if (correct_answers_text.includes(answer))
          {
            res_score += question.point_value
          }
        });
        console.log("RESULT DICT: " + JSON.stringify(result_dict))
        console.log("SCORE: " + res_score)
        const result = await Survey_R.create({email: user.email, survey_id: survey.survey_id, results: result_dict, score: res_score })
        res.redirect('/home/?msg=success')
      }
      else
      {
        questions.forEach(question => {
          const answer = req.body[question.question_id]
          console.log("ANSWER: " + answer) 
          if (answer !== undefined)
          {
            result_dict[question.question_id] = answer
          }
        });
        console.log("RESULT DICT: " + JSON.stringify(result_dict))
        const result = await Survey_R.create({email: user.email, survey_id: survey.survey_id, results: result_dict })
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

router.get('/h2f', async function(req, res, next) {
  res.redirect('h2f');
});

router.get('/unitsummary', async function(req, res, next) {
  res.redirect('unitsummary');
});

router.get('/cpa', async function(req, res, next) {
  res.redirect('cpa');
});

router.get('/fms', async function(req, res, next) {
  res.redirect('fms');
});



module.exports = router;
