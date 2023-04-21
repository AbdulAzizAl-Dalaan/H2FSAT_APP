var express = require('express');
/* ADD YOUR MODELS HERE */
const User = require('../models/User')
const CPA_R = require('../models/CPA/CPA_R')
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
    /* ADD ANY NECESSARY QUERIES HERE BEFORE RENDERING PAGE */
  const results = await CPA_R.findAll({where: {email: req.session.user.email}})
  if (results.length === 0)//checking if they have taken the exam
  {
    res.render('cpa');
  }
  else
  {
    res.redirect('/home/?msg=already')
  }


    
});

router.post('/submit', async function(req, res, next) {
  /* ADD ANY NECESSARY QUERIES AND CREATIONS BEFORE SUBMITTING ASSESSMENT 
      AND REDIRECTING BACK TO HOME PAGE  */

  const user = await User.findByPk(req.session.user.email);

  if (user !== null) {
    // Collect submitted data from the form
    //cpa Motivation
    const motivation_physical = parseInt(req.body.motivation_physical);
    if (motivation_physical < 0 || motivation_physical > 10) {
      res.redirect('/cpa/?msg=Invalid motivation_physical value');//checking if a valid entry
      return;
    }
    const motivation_mental = parseInt(req.body.motivation_mental);
    if (motivation_mental < 0 || motivation_mental > 10) {
      res.redirect('/cpa/?msg=Invalid motivation_mental value');
      return;
    }
    const motivation_nutritional = parseInt(req.body.motivation_nutritional);
    if (motivation_nutritional < 0 || motivation_nutritional > 10) {
      res.redirect('/cpa/?msg=Invalid motivation_nutritional value');
      return;
    }
    const motivation_spiritual = parseInt(req.body.motivation_spiritual);
    if (motivation_spiritual < 0 || motivation_spiritual > 10) {
      res.redirect('/cpa/?msg=Invalid motivation_spiritual value');
      return;
    }
    const motivation_sleep = parseInt(req.body.motivation_sleep);
    if (motivation_sleep < 0 || motivation_sleep > 10) {
      res.redirect('/cpa/?msg=Invalid motivation_sleep value');
      return;
    }
    //getting total score for this section of the exam
    const total_score = motivation_physical + motivation_mental + motivation_nutritional + motivation_spiritual + motivation_sleep;
    //ability
    const abilityPH = parseInt(req.body.abilityPH);
    if (abilityPH < 0 || abilityPH > 10) {
      res.redirect('/cpa/?msg=Invalid abilityPH value');
      return;
    }
    const abilityMH = parseInt(req.body.abilityMH);
    if (abilityMH < 0 || abilityMH > 10) {
      res.redirect('/cpa/?msg=Invalid abilityMH value');
      return;
    }
    const abilityNH = parseInt(req.body.abilityNH);
    if (abilityNH < 0 || abilityNH > 10) {
      res.redirect('/cpa/?msg=Invalid abilityNH value');
      return;
    }
    const abilitySPH = parseInt(req.body.abilitySPH);
    if (abilitySPH < 0 || abilitySPH > 10) {
      res.redirect('/cpa/?msg=Invalid abilitySPH value');
      return;
    }
    const abilitySLH = parseInt(req.body.abilitySLH);
    if (abilitySLH < 0 || abilitySLH > 10) {
      res.redirect('/cpa/?msg=Invalid abilitySLH value');
      return;
    }
    const abilityTS = abilityPH + abilityMH + abilityNH + abilitySPH + abilitySLH;
    //current
    const curPH = parseInt(req.body.curPH);
    if (curPH < 0 || curPH > 10) {
      res.redirect('/cpa/?msg=Invalid curPH value');
      return;
    }
    const curMH = parseInt(req.body.curMH);
    if (curMH < 0 || curMH > 10) {
      res.redirect('/cpa/?msg=Invalid curMH value');
      return;
    }
    const curNH = parseInt(req.body.curNH);
    if (curNH < 0 || curNH > 10) {
      res.redirect('/cpa/?msg=Invalid curNH value');
      return;
    }
    const curSPH = parseInt(req.body.curSPH);
    if (curSPH < 0 || curSPH > 10) {
      res.redirect('/cpa/?msg=Invalid curSPH value');
      return;
    }
    const curSLH = parseInt(req.body.curSLH);
    if (curSLH < 0 || curSLH > 10) {
      res.redirect('/cpa/?msg=Invalid curSLH value');
      return;
    }
    const curTS = curPH + curMH + curNH + curSPH + curSLH;
    //const total_score = req.body.total_score;
    

    // Save assessment data
    const result = await CPA_R.create({
      email: user.email,
      unit: user.unit,
      motivation_physical: motivation_physical,
      motivation_mental: motivation_mental,
      motivation_nutritional: motivation_nutritional,
      motivation_spiritual: motivation_spiritual,
      motivation_sleep: motivation_sleep,
      total_score: total_score,
      abilityPH: abilityPH,
      abilityMH: abilityMH,
      abilityNH: abilityNH,
      abilitySPH: abilitySPH,
      abilitySLH: abilitySLH,
      abilityTS: abilityTS,
      curPH: curPH,
      curMH: curMH,
      curNH: curNH,
      curSPH: curSPH,
      curSLH: curSLH,
      curTS: curTS,
    });

    res.redirect('/home/?msg=success');
  } else {
    res.redirect('/?msg=raf');
  }

  //res.redirect('/home/?msg=success');
});

module.exports = router;