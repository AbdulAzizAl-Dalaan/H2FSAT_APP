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
    res.render('cpa');
});

router.post('/submit', async function(req, res, next) {
    /* ADD ANY NECESSARY QUERIES AND CREATIONS BEFORE SUBMITTING ASSESSMENT 
       AND REDIRECTING BACK TO HOME PAGE  */

       const user = await User.findByPk(req.session.user.email);

    if (user !== null) {
      // Collect submitted data from the form
      //cpa Motivation
      const motivation_physical = parseInt(req.body.motivation_physical);
      const motivation_mental = parseInt(req.body.motivation_mental);
      const motivation_nutritional = parseInt(req.body.motivation_nutritional);
      const motivation_spiritual = parseInt(req.body.motivation_spiritual);
      const motivation_sleep = parseInt(req.body.motivation_sleep);
      const total_score = motivation_physical + motivation_mental + motivation_nutritional + motivation_spiritual + motivation_sleep;
      //ability
      const abilityPH = parseInt(req.body.abilityPH);
      const abilityMH = parseInt(req.body.abilityMH);
      const abilityNH = parseInt(req.body.abilityNH);
      const abilitySPH = parseInt(req.body.abilitySPH);
      const abilitySLH = parseInt(req.body.abilitySLH);
      const abilityTS = abilityPH + abilityMH + abilityNH + abilitySPH + abilitySLH;
      //current
      const curPH = parseInt(req.body.curPH);
      const curMH = parseInt(req.body.curMH);
      const curNH = parseInt(req.body.curNH);
      const curSPH = parseInt(req.body.curSPH);
      const curSLH = parseInt(req.body.curSLH);
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