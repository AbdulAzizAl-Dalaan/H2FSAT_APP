const express = require('express');
const router = express.Router();
const User = require('../models/User')
const FMS_Q = require('../models/FMS/FMS_Q')
const FMS_A = require('../models/FMS/FMS_A')
const FMS_R = require('../models/FMS/FMS_R')
//const { FMS_Q, FMS_A, FMS_R } = require('../models');
const { Op } = require('sequelize');

const sessionChecker = (req, res, next) => {
    if (req.session.user) {
        res.locals.firstname = req.session.user.firstname;
        res.locals.lastname = req.session.user.lastname;
        res.locals.unit = req.session.user.unit;
        res.locals.rank = req.session.user.rank;
        res.locals.email = req.session.user.email;
        res.locals.isAdmin = req.session.user.isAdmin;
        res.locals.isUnitLeader = req.session.user.isUnitLeader;
        next();
    } else {
        res.redirect("/?msg=raf");
    }
};

router.use(sessionChecker);

router.get('/', async function(req, res, next) {
    res.render('fms');
  
    //res.render('fms')
});

router.post('/submit', async function(req, res, next) {
  /* ADD ANY NECESSARY QUERIES AND CREATIONS BEFORE SUBMITTING ASSESSMENT 
     AND REDIRECTING BACK TO HOME PAGE  */

     const user = await User.findByPk(req.session.user.email);

  if (user !== null) {
    
    const deep_squat = parseInt(req.body.deep_squat);
    const hurdle_step = parseInt(req.body.hurdle_step);
    const inline_lunge = parseInt(req.body.inline_lunge);
    const shoulder_mobility = parseInt(req.body.shoulder_mobility);
    const active_straight_leg_raise = parseInt(req.body.active_straight_leg_raise);
    const trunk_stability_pushup = parseInt(req.body.trunk_stability_pushup);
    const rotary_stability = parseInt(req.body.rotary_stability);
    const score = deep_squat+hurdle_step+inline_lunge+shoulder_mobility+active_straight_leg_raise+trunk_stability_pushup+rotary_stability;
    const fms_grader = String(req.body.fms_grader);
    

    const result = await FMS_R.create({
      email: user.email,
      unit: user.unit,
      deep_squat: deep_squat,
      hurdle_step: hurdle_step,
      inline_lunge: inline_lunge,
      shoulder_mobility: shoulder_mobility,
      active_straight_leg_raise: active_straight_leg_raise,
      trunk_stability_pushup: trunk_stability_pushup,
      rotary_stability: rotary_stability,
      score: score,
      fms_grader: fms_grader,
    });

    res.redirect('/home/?msg=success');
  } else {
    res.redirect('/?msg=raf');
  }

  //res.redirect('/home/?msg=success');
});

module.exports = router;
