var express = require('express');
const User = require('../models/User')
const H2F_Q = require('../models/H2F/H2F_Q')
const H2F_A = require('../models/H2F/H2F_A')
const H2F_R = require('../models/H2F/H2F_R')
const CPA_R = require('../models/CPA/CPA_R')//cpa model
var router = express.Router();

//cpa boolean
let boolTSCore = false;

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
    let correct_result = await H2F_A.findAll({where: {correct: true}})
    let correct_answers = {}
    correct_result.forEach((result) => {
        correct_answers[result.qid] = result.aid
    })
    // merge the two on email
    let total_results = []
    let cpa_col = []//delete if does not work for CPA
    for (let i = 0; i < users.length; i++)
    {
        let user = users[i]
        /*CPA STUFF BELOW */
        let cpa_result = await CPA_R.findOne({where: {email: user.email}})
        let holder = 1

        if(cpa_result !== null)
        {
            if (cpa_result && cpa_result.total_score && cpa_result.abilityTS && cpa_result.curTS) {
                if(cpa_result.total_score <= 25 || cpa_result.abilityTS <= 25 || cpa_result.curTS <= 25)
                {
                    boolTSCore = true;
                }
                //cpa_result = JSON.parse(cpa_result.total_score, cpa_result.abilityTS, cpa_result.curTS);//may be problem here
                cpa_result = { total_score: cpa_result.total_score, abilityTS: cpa_result.abilityTS, curTS: cpa_result.curTS };
            } else {
                tscore = 'N/A';
                boolTSCore = false;
                cpa_result = {}; // Or any other default value you want to use
            }
            holder = 0

        }
        /*CPA STUFF ABOVE */

        let h2f_result = await H2F_R.findOne({where: {email: user.email}})
        if (h2f_result !== null)
        {
            let physical = 0, physical_total = 0
            let nutrition = 0, nutrition_total = 0
            let mental = 0, mental_total = 0
            let spiritual = 0, spiritual_total = 0
            let sleep = 0, sleep_total = 0
            let h2f_score = h2f_result.score
            h2f_result = JSON.parse(h2f_result.results)
            for (let j = 1; j < correct_result.length + 1; j++)
            {
                if (j < 3)
                {
                    physical_total += 1
                    physical += h2f_result[j] === correct_answers[j] ? 1 : 0
                }
                else if (j < 5)
                {
                    nutrition_total += 1
                    nutrition += h2f_result[j] === correct_answers[j] ? 1 : 0
                }
                else if (j < 7)
                {
                    mental_total += 1
                    mental += h2f_result[j] === correct_answers[j] ? 1 : 0
                }
                else if (j < 9)
                {
                    spiritual_total += 1
                    spiritual += h2f_result[j] === correct_answers[j] ? 1 : 0
                }
                else if (j < 11)
                {
                    sleep_total += 1
                    sleep += h2f_result[j] === correct_answers[j] ? 1 : 0
                }
            }
            //if holder = 0 then it means the test has been taken otherwise it has not been taken
            if(holder == 0){
                total_results.push(
                    {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        rank: user.rank,
                        h2f_score: h2f_score,
                        physical: (physical / physical_total) * 100,
                        nutrition: (nutrition / nutrition_total) * 100,
                        mental: (mental / mental_total) * 100,
                        spiritual: (spiritual / spiritual_total) * 100,
                        sleep: (sleep / sleep_total) * 100,
                        cpa: boolTSCore,
                    }
                )
            }
            else{
                total_results.push(
                    {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        rank: user.rank,
                        h2f_score: h2f_score,
                        physical: (physical / physical_total) * 100,
                        nutrition: (nutrition / nutrition_total) * 100,
                        mental: (mental / mental_total) * 100,
                        spiritual: (spiritual / spiritual_total) * 100,
                        sleep: (sleep / sleep_total) * 100,
                        cpa: 'N/A',
                    }
                )
            }
            boolTSCore = false
            holder = 1
        }
        else
        {
            if(holder == 0)
            {
                total_results.push(
                    {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        rank: user.rank,
                        h2f_score: 'N/A',
                        physical: 'N/A',
                        nutrition: 'N/A',
                        mental: 'N/A',
                        spiritual: 'N/A',
                        sleep: 'N/A',
                        cpa: boolTSCore,
                    }
                )
            }
            else{
                total_results.push(
                    {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        rank: user.rank,
                        h2f_score: 'N/A',
                        physical: 'N/A',
                        nutrition: 'N/A',
                        mental: 'N/A',
                        spiritual: 'N/A',
                        sleep: 'N/A',
                        cpa: 'N/A',
                    }
                )

            }
            boolTSCore = false
        }
        
        
    }
    res.render('unitsummary', {total_results});
});

module.exports = router;
