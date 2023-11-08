var express = require('express');
var router = express.Router();
const User = require('../models/User')
const Unit = require('../models/Unit')

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
    if(req.query.msg)
    {
        res.locals.msg = req.query.msg
    }
    res.render('profile');
});

router.post('/', async function(req, res, next) {
    if (req.query.msg) {
        res.locals.msg = req.query.msg;
    }
    const user = await User.findOne({where: {email: req.session.user.email}});
    if (user) {
      // req.body.dob stored at 2000-07-05 format yyyy-mm-dd check to see if date is at least 17 years old
      const currentYear = new Date().getFullYear();
      const dobYear = req.body.dob.split('-')[0];
      const dobMonth = req.body.dob.split('-')[1];
      const dobDay = req.body.dob.split('-')[2];
      if (currentYear - dobYear < 17) {
        res.redirect('/profile?msg=profile-date-error');
        return;
      }
      else if (currentYear - dobYear == 17) {
        const currentMonth = new Date().getMonth() + 1;
        if (currentMonth < dobMonth) {
          res.redirect('/profile?msg=profile-date-error');
          return;
        }
        else if (currentMonth == dobMonth) {
          const currentDay = new Date().getDate();
          if (currentDay < dobDay) {
            res.redirect('/profile?msg=profile-date-error');
            return;
          }
        }
      }

      const unit = await Unit.findOne({where: {uic: req.body.unit, state: req.body.state}});
      if (!unit) {
        res.redirect('/profile?msg=profile-unit-error');
        return;
      }

      user.unit = req.body.unit;
      user.state = req.body.state;
      user.rank = req.body.rank;
      user.gender = req.body.gender;
      user.dob = req.body.dob; // might need further validation
      await user.save();
      res.redirect('/?msg=profileupdated');
    }
    else 
    {
      res.redirect('/profile?msg=profilerror');
    }
});

module.exports = router;