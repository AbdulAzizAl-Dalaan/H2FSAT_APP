const express = require('express');
const multer = require('multer');
const fs = require('fs');
const XLSX = require('xlsx'); 

const User = require('../models/User');
const H2F_A = require('../models/H2F/H2F_A');
const H2F_Q = require('../models/H2F/H2F_Q');
const H2F_R = require('../models/H2F/H2F_R');
const CPA_R = require('../models/CPA/CPA_R');
const FMS_R = require('../models/FMS/FMS_R');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

//they have to be an admin or unitleader to upload excel can easily change to just admin
router.get('/csv', (req, res) => {
    res.render('upload', {
        isAdmin: true,
        isUnitLeader: true
    }); 
});

router.post('/handle-upload', upload.single('csvfile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }
        const uploadType = req.body.uploadType;
        const workbook = XLSX.readFile(req.file.path);
        const sheet_name_list = workbook.SheetNames;
        const results = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        for (let row of results) {

            if(uploadType == 'cpa_h2f')
            {
            const userObj = {
                firstname: row['First Name'],
                lastname: row['Last name'],
                unit: row['Unit'],
                email: row['email'],
                rank: row['rank'],
                isUnitLeader: row['Are you a Unit leader?'] === 'Yes'
            };
            await User.create(userObj);

            let answers = {};
            for (let i = 1; i <= 10; i++) {
                //get the question from the database for the current index
                const currentQuestion = await H2F_Q.findOne({
                    where: {
                        qid: i
                    }
                });

                if (!currentQuestion) {
                    console.error(`No question found for index ${i}`);
                    continue; 
                }

                let questionKey = `(${i})  ${currentQuestion.question}`;
                let answer = await H2F_A.findOne({
                    where: {
                        qid: i,
                        answer: row[questionKey]
                    }
                });
                answers[i] = answer ? answer.aid : null;
            }

            const resultObj = {
                email: row['email'],
                unit: row['Unit'],
                results: JSON.stringify(answers),
                score: Object.values(answers).filter(aid => aid).length
            };
            await H2F_R.create(resultObj);

            const cpaObj = {
                email: row['email'],
                unit: row['Unit'],
                motivation_physical: row['Motivation to live a healthy lifestyle in each category: Physical'],
                motivation_mental: row['Motivation to live a healthy lifestyle in each category: Mental'],
                motivation_nutritional: row['Motivation to live a healthy lifestyle in each category: Nutritional'],
                motivation_spiritual: row['Motivation to live a healthy lifestyle in each category: Spiritual'],
                motivation_sleep: row['Motivation to live a healthy lifestyle in each category: Sleep'],
                abilityPH: row['Ability to live a healthy lifestyle in each category: Physical'],
                abilityMH: row['Ability to live a healthy lifestyle in each category: Mental'],
                abilityNH: row['Ability to live a healthy lifestyle in each category: Nutritional'],
                abilitySPH: row['Ability to live a healthy lifestyle in each category: Spiritual'],
                abilitySLH: row['Ability to live a healthy lifestyle in each category: Sleep'],
                curPH: row['Current (past 7 days) self-rating of my: Physical'],
                curMH: row['Current (past 7 days) self-rating of my: Mental'],
                curNH: row['Current (past 7 days) self-rating of my: Nutritional'],
                curSPH: row['Current (past 7 days) self-rating of my: Spiritual'],
                curSLH: row['Current (past 7 days) self-rating of my: Sleep']
            };

            cpaObj.total_score = cpaObj.motivation_physical + cpaObj.motivation_mental + 
                     cpaObj.motivation_nutritional + cpaObj.motivation_spiritual + 
                     cpaObj.motivation_sleep;

            cpaObj.abilityTS = cpaObj.abilityPH + cpaObj.abilityMH + cpaObj.abilityNH +
                            cpaObj.abilitySPH + cpaObj.abilitySLH;

            cpaObj.curTS = cpaObj.curPH + cpaObj.curMH + cpaObj.curNH + cpaObj.curSPH + cpaObj.curSLH;


            await CPA_R.create(cpaObj);

        }

            else if(uploadType == 'fms'){

            
            //for (let row of results) {
                // Extracting data from the row
                const fmsObj = {
                    email: row['First Name'] + "." + row['Last Name'] + "@domain.com",  // Assuming this structure for email. Adjust as needed.
                    unit: row['Unit UIC'],
                    deep_squat: row['Deep Squat'],
                    hurdle_step: (row['Hurdle Step [Left]'] + row['Hurdle Step [Right]']) / 2, // Averaging left and right values
                    inline_lunge: (row['Incline Lunge [Left]'] + row['Incline Lunge [Right]']) / 2, // Averaging left and right values
                    shoulder_mobility: (row['Shoulder Mobility [Left]'] + row['Shoulder Mobility [Right]']) / 2, // Averaging left and right values
                    active_straight_leg_raise: (row['Active Straight Leg Raise [Left]'] + row['Active Straight Leg Raise [Right]']) / 2, // Averaging left and right values
                    trunk_stability_pushup: row['Trunk Stability Pushup'],
                    rotary_stability: (row['Rotary Stability [Left]'] + row['Rotary Stability [Right]']) / 2, // Averaging left and right values
                    fms_grader: row['Grader']
                };
            
                // Calculating the total score for FMS
                fmsObj.score = fmsObj.deep_squat + fmsObj.hurdle_step + fmsObj.inline_lunge + fmsObj.shoulder_mobility + 
                               fmsObj.active_straight_leg_raise + fmsObj.trunk_stability_pushup + fmsObj.rotary_stability;
            
                // Saving the data to the database
                await FMS_R.create(fmsObj);
            //}

        }





        }

        res.send('Excel data saved successfully!');
    } catch (error) {
        console.error('Error processing the Excel file:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
    }
});

module.exports = router;





// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const XLSX = require('xlsx'); 

// const User = require('../models/User');
// const H2F_A = require('../models/H2F/H2F_A');
// const H2F_Q = require('../models/H2F/H2F_Q');
// const H2F_R = require('../models/H2F/H2F_R');
// const CPA_R = require('../models/CPA/CPA_R');
// const FMS_R = require('../models/FMS/FMS_R');

// const router = express.Router();

// const upload = multer({ dest: 'uploads/' });

// //they have to be an admin or unitleader to upload excel can easily change to just admin
// router.get('/csv', (req, res) => {
//     res.render('upload', {
//         isAdmin: true,
//         isUnitLeader: true
//     }); 
// });

// router.post('/handle-upload', upload.single('csvfile'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).send("No file uploaded.");
//         }

//         const workbook = XLSX.readFile(req.file.path);
//         const sheet_name_list = workbook.SheetNames;
//         const results = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

//         for (let row of results) {
//             const userObj = {
//                 firstname: row['First Name'],
//                 lastname: row['Last name'],
//                 unit: row['Unit'],
//                 email: row['email'],
//                 rank: row['rank'],
//                 isUnitLeader: row['Are you a Unit leader?'] === 'Yes'
//             };
//             await User.create(userObj);

//             let answers = {};
//             for (let i = 1; i <= 10; i++) {
//                 //get the question from the database for the current index
//                 const currentQuestion = await H2F_Q.findOne({
//                     where: {
//                         qid: i
//                     }
//                 });

//                 if (!currentQuestion) {
//                     console.error(`No question found for index ${i}`);
//                     continue; 
//                 }

//                 let questionKey = `(${i})  ${currentQuestion.question}`;
//                 let answer = await H2F_A.findOne({
//                     where: {
//                         qid: i,
//                         answer: row[questionKey]
//                     }
//                 });
//                 answers[i] = answer ? answer.aid : null;
//             }

//             const resultObj = {
//                 email: row['email'],
//                 unit: row['Unit'],
//                 results: JSON.stringify(answers),
//                 score: Object.values(answers).filter(aid => aid).length
//             };
//             await H2F_R.create(resultObj);

//             const cpaObj = {
//                 email: row['email'],
//                 unit: row['Unit'],
//                 motivation_physical: row['Motivation to live a healthy lifestyle in each category: Physical'],
//                 motivation_mental: row['Motivation to live a healthy lifestyle in each category: Mental'],
//                 motivation_nutritional: row['Motivation to live a healthy lifestyle in each category: Nutritional'],
//                 motivation_spiritual: row['Motivation to live a healthy lifestyle in each category: Spiritual'],
//                 motivation_sleep: row['Motivation to live a healthy lifestyle in each category: Sleep'],
//                 abilityPH: row['Ability to live a healthy lifestyle in each category: Physical'],
//                 abilityMH: row['Ability to live a healthy lifestyle in each category: Mental'],
//                 abilityNH: row['Ability to live a healthy lifestyle in each category: Nutritional'],
//                 abilitySPH: row['Ability to live a healthy lifestyle in each category: Spiritual'],
//                 abilitySLH: row['Ability to live a healthy lifestyle in each category: Sleep'],
//                 curPH: row['Current (past 7 days) self-rating of my: Physical'],
//                 curMH: row['Current (past 7 days) self-rating of my: Mental'],
//                 curNH: row['Current (past 7 days) self-rating of my: Nutritional'],
//                 curSPH: row['Current (past 7 days) self-rating of my: Spiritual'],
//                 curSLH: row['Current (past 7 days) self-rating of my: Sleep']
//             };

//             cpaObj.total_score = cpaObj.motivation_physical + cpaObj.motivation_mental + 
//                      cpaObj.motivation_nutritional + cpaObj.motivation_spiritual + 
//                      cpaObj.motivation_sleep;

//             cpaObj.abilityTS = cpaObj.abilityPH + cpaObj.abilityMH + cpaObj.abilityNH +
//                             cpaObj.abilitySPH + cpaObj.abilitySLH;

//             cpaObj.curTS = cpaObj.curPH + cpaObj.curMH + cpaObj.curNH + cpaObj.curSPH + cpaObj.curSLH;


//             await CPA_R.create(cpaObj);


//             for (let row of results) {
//                 // Extracting data from the row
//                 const fmsObj = {
//                     email: row['First Name'] + "." + row['Last Name'] + "@domain.com",  // Assuming this structure for email. Adjust as needed.
//                     unit: row['Unit UIC'],
//                     deep_squat: row['Deep Squat'],
//                     hurdle_step: (row['Hurdle Step [Left]'] + row['Hurdle Step [Right]']) / 2, // Averaging left and right values
//                     inline_lunge: (row['Incline Lunge [Left]'] + row['Incline Lunge [Right]']) / 2, // Averaging left and right values
//                     shoulder_mobility: (row['Shoulder Mobility [Left]'] + row['Shoulder Mobility [Right]']) / 2, // Averaging left and right values
//                     active_straight_leg_raise: (row['Active Straight Leg Raise [Left]'] + row['Active Straight Leg Raise [Right]']) / 2, // Averaging left and right values
//                     trunk_stability_pushup: row['Trunk Stability Pushup'],
//                     rotary_stability: (row['Rotary Stability [Left]'] + row['Rotary Stability [Right]']) / 2, // Averaging left and right values
//                     fms_grader: row['Grader']
//                 };
            
//                 // Calculating the total score for FMS
//                 fmsObj.score = fmsObj.deep_squat + fmsObj.hurdle_step + fmsObj.inline_lunge + fmsObj.shoulder_mobility + 
//                                fmsObj.active_straight_leg_raise + fmsObj.trunk_stability_pushup + fmsObj.rotary_stability;
            
//                 // Saving the data to the database
//                 await FMS_R.create(fmsObj);
//             }





//         }

//         res.send('Excel data saved successfully!');
//     } catch (error) {
//         console.error('Error processing the Excel file:', error);
//         res.status(500).send('Internal Server Error');
//     } finally {
//         if (req.file) {
//             fs.unlinkSync(req.file.path);
//         }
//     }
// });

// module.exports = router;