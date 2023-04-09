var express = require('express');
const User = require('../models/User')
const H2F_Q = require('../models/H2F/H2F_Q')
const H2F_A = require('../models/H2F/H2F_A')
const H2F_R = require('../models/H2F/H2F_R')
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
      const answers = await H2F_A.findAll({where: {correct: true}})
      let results = {}
      let score = 0
      answers.forEach((answer) => {
        // console.log(req.body[answer.qid], answer.answer)
        // console.log(req.body[answer.qid] === answer.answer)
        if (req.body[answer.qid] === answer.answer)
        {
          score += 1
        }
        results[answer.qid] = req.body[answer.qid]
      });
      const result = await H2F_R.create({ email: user.email, unit: user.unit, results: JSON.stringify(results), score: score })
      res.redirect('/home/?msg=success')
    }
  }
  else
  {
    res.redirect('/?msg=raf')
  }
});


module.exports = router;