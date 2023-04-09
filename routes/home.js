var express = require('express');
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
  if (req.query.msg)
  {
    res.locals.msg = req.query.msg
  }
  console.log("CURRENT USER:" + req.session.user.email)
  res.render('home');
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
