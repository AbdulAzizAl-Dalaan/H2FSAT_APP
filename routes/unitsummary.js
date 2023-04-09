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
    let total_results = []
    for (let i = 0; i < users.length; i++)
    {
        let user = users[i]
        let h2f_result = await H2F_R.findOne({where: {email: user.email}})
        let h2f_score = "N/A"
        if (h2f_result !== null) {
            h2f_score = h2f_result.score
        }
        total_results.push(
            {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                rank: user.rank,
                h2f_score: h2f_score
            }
        )
    }
    res.render('unitsummary', {total_results});
});

module.exports = router;
