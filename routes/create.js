var express = require('express');
var router = express.Router();
const User = require('../models/User')
const Survey_Info = require('../models/Survey/Survey_Info')
const Survey_Q = require('../models/Survey/Survey_Q')
const Survey_A = require('../models/Survey/Survey_A')
const Survey_R = require('../models/Survey/Survey_R');

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
  if (req.query.msg)
  {
    res.locals.msg = req.query.msg
  }
  console.log("CURRENT USER:" + req.session.user.email)
  res.render('create');
});

router.post('/', async function(req, res, next) {
    console.log("BODY CONTENTS:")
    console.log(req.body)
    const survey = await Survey_Info.create({title: req.body.title, author: req.session.user.email, description: req.body.description, 
        secure: req.body.secure === 'on' ? true : false, password: req.body.secure === 'on' ? req.body.password : null, 
        grade_by_points: req.body.grade_by_points === 'on' ? true : false, show_question_numbers: req.body.show_question_numbers === 'on' ? true : false})
    // ADD CODE TO CREATE SURVEY QUESTIONS AND ANSWERS HERE
    let i = 1
    while (req.body['question_' + i + '_title'] !== undefined)
    {
      console.log(req.body['question_' + i + '_title'])
      console.log(req.body['question_' + i + '_type'])
      const question = await Survey_Q.create({survey_id: survey.survey_id, prompt: req.body['question_' + i + '_title'], type: req.body['question_' + i + '_type'], top_range: req.body['question_' + i + '_number_range_top'], bottom_range: req.body['question_' + i + '_number_range_bottom'], point_value: req.body['question_' + i + '_point_value']})
      i++;
      /*
      if (question.type === 'checkbox' || question.type === 'multiple_choice')
      {
        let j = 1
        while (req.body['question_' + i + '_answer_' + j])
        {
          await Survey_A.create({survey_id: survey.survey_id, question_id: question.question_id, answer: req.body['question_' + i + '_answer_' + j]})
          j++;
        }
      }
      */
    }
    res.redirect('home')
}); 

module.exports = router;
