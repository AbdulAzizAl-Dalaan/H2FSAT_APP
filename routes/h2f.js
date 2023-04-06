var express = require('express');
const User = require('../models/User')
const H2F_Q = require('../models/H2F/H2F_Q')
const H2F_A = require('../models/H2F/H2F_A')
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
  if(req.query.msg)
  {
    res.locals.msg = req.query.msg
  }
  const questions = await H2F_Q.findAll()
  const answers = await H2F_A.findAll()

  // iteration through questions using foreach
    questions.forEach((question) => {
        // iteration through answers using foreach
        console.log(question.question)
        answers.forEach((answer) => {
            // if question id is equal to answer question id
            //console.log(typeof question.qid)
            //console.log(typeof answer.qid)
            if (question.qid === answer.qid) {
                // add answer to question
                console.log(answer.answer)
            }
        });
    });
  
  res.render('h2f', {questions, answers});
});

router.get("/:qid", async function(req, res, next) {
    const question = await H2F_Q.findOne({ where: { qid: req.params.qid } });
    if(question)
    {
      res.render('h2f_question', { question });
    }
    else
    {
      res.redirect('/h2f/?msg=course+not+found&?qid=' + req.params.courseid)
    }
  });

module.exports = router;