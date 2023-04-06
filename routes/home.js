var express = require('express');
var router = express.Router();

const sessionChecker = (req, res, next) => {
  if(req.session.user)
  {
    res.locals.email = req.session.user.email
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

module.exports = router;
