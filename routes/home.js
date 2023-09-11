var express = require('express');
var router = express.Router();
const Survey_Info = require('../models/Survey/Survey_Info')
const Survey_Q = require('../models/Survey/Survey_Q')
const Survey_A = require('../models/Survey/Survey_A')
const Survey_R = require('../models/Survey/Survey_R')

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
    const questions = await Survey_Q.findAll({where: {survey_id: survey.survey_id}})
    const answers = await Survey_A.findAll({where: {survey_id: survey.survey_id}})
    res.render('survey', {survey, questions, answers});
  }
  else
  {
    res.redirect('/home/?msg=notfound')
  }
  
});

router.post('/:id/submit', async function(req, res, next) {
  const survey = await Survey_Info.findByPk(req.params.id)
  if (survey !== null)
  {
    // put logic here to check results
    console.log("INTO SUBMIT")
    res.redirect('/home/?msg=success')
  }
  else
  {
    res.redirect('/home/?msg=notfound')
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
