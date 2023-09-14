const express = require('express');
const multer = require('multer');
const fs = require('fs');
const XLSX = require('xlsx'); 

const User = require('../models/User');
const H2F_A = require('../models/H2F/H2F_A');
const H2F_Q = require('../models/H2F/H2F_Q');
const H2F_R = require('../models/H2F/H2F_R');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.get('/csv', (req, res) => {
    res.render('upload'); 
});

router.post('/handle-upload', upload.single('csvfile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const workbook = XLSX.readFile(req.file.path);
        const sheet_name_list = workbook.SheetNames;
        const results = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        for (let row of results) {
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
                // Fetch the question from the database for the current index
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
// const csvParser = require('csv-parser');
// const fs = require('fs');
// const User = require('../models/User'); // adjust the path to where your User model is located

// const router = express.Router();

// const upload = multer({ dest: 'uploads/' });

// router.get('/csv', (req, res) => {
//     res.render('upload');  // Render the upload form
// });

// router.post('/handle-upload', upload.single('csvfile'), async (req, res) => {
//     const results = [];
    
//     fs.createReadStream(req.file.path)
//         .pipe(csvParser())
//         .on('data', (data) => results.push(data))
//         .on('end', async () => {
//             // Process the results
//             for(let row of results){
//                 try {
//                     const userObj = {
//                         firstname: row['First Name'],
//                         lastname: row['Last name'],
//                         unit: row['Unit'],
//                         email: row['email'],
//                         rank: row['rank'],
//                         isUnitLeader: row['Are you a Unit leader?'].toLowerCase() === 'yes'
//                     };

//                     console.log("Inserting user:", userObj);
                    
//                     await User.create(userObj);
//                 } catch (error) {
//                     console.error('Error saving user:', error.message);
//                 }
//             }
//             res.send('CSV data saved successfully!');
//         });
// });

// module.exports = router;




