var express = require('express');
const User = require('../models/User')
const H2F_Q = require('../models/H2F/H2F_Q')
const H2F_A = require('../models/H2F/H2F_A')
const H2F_R = require('../models/H2F/H2F_R')
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

    /* 
    * Will have to be change based on future additions to the database
    */
    
    const users = await User.findAll({where: {unit: req.session.user.unit}})
    const h2f_results = await H2F_R.findAll({where: {unit: req.session.user.unit}})
    // merge the two on email
    

    res.render('unitsummary', {h2f_results});
});

module.exports = router;
