var express = require('express');
const User = require('../models/User')
const H2F_Q = require('../models/H2F/H2F_Q')
const H2F_A = require('../models/H2F/H2F_A')
const H2F_R = require('../models/H2F/H2F_R')
const { Op } = require('sequelize')
var router = express.Router();


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
  const results = await H2F_R.findAll({where: {email: req.session.user.email}})
  if (results.length === 0)
  {
    const questions = await H2F_Q.findAll()
    const answers = await H2F_A.findAll()
    res.render('h2f', {questions, answers});
  }
  else
  {
    res.redirect('/home/?msg=already')
  }
});

router.post('/submit', async function(req, res, next) {
  if (req.query.msg)
  {
    res.locals.msg = req.query.msg
  }
  const user = await User.findByPk(req.session.user.email);
  if (user !== null)
  {
    const results = await H2F_R.findAll({where: {email: user.email}})
    if (results.length !== 0)
    {
      res.redirect('/h2f/?msg=already')
    }
    else 
    {
      const questions = await H2F_Q.findAll()
      const answers = await H2F_A.findAll()
      question_to_answers = {}
      answer_to_aid = {}
      answers.forEach(answer => { // 38
        answer_to_aid[answer.answer] = [answer.aid, answer.correct] 
        if (question_to_answers[answer.qid])
        {
          question_to_answers[answer.qid].push(answer.answer)
        }
        else
        {
          question_to_answers[answer.qid] =  [answer.answer]
        }
      });
      let my_results = {}
      let score = 0

      for (let i = 1; i < questions.length + 1; i++) // 10
      {
        let qid = i
        let answer = req.body[qid]
        let aid = answer_to_aid[answer][0]
        let correct = answer_to_aid[answer][1]
        if (correct)
        {
          score += 1
        }
        my_results[qid] = aid
      }
      const result = await H2F_R.create({ email: user.email, unit: user.unit, results: JSON.stringify(my_results), score: score })
      res.redirect('/home/?msg=success')
    }
  }
  else
  {
    res.redirect('/?msg=raf')
  }
});


module.exports = router;