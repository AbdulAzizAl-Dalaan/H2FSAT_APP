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