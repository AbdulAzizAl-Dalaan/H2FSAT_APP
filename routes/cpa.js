var express = require('express');
/* ADD YOUR MODELS HERE */
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

    res.redirect('/home/?msg=success');
});

module.exports = router;