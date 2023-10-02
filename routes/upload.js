

const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const User = require('../models/User');
const Survey_R = require('../models/Survey/Survey_R');
const Survey_Info = require('../models/Survey/Survey_Info');
const Survey_Q = require('../models/Survey/Survey_Q');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    const isAdmin = true;  
    const isUnitLeader = true;
    res.render('upload', { isAdmin, isUnitLeader });
});

router.post('/handle-upload', upload.single('file'), async (req, res) => {
    try {
        // Check for user session
        // if (!req.user) {
        //     return res.status(400).send("User is not logged in.");
        // }

        // Check if file exists
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const buffer = req.file.buffer;
        const workbook = xlsx.read(buffer, { type: 'buffer' });

        const sheet_name_list = workbook.SheetNames;
        const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        
        // Additional logging to diagnose issues
        console.log("Excel Data:", xlData);

        

        const title = req.file.originalname.split('.').slice(0, -1).join('.');
        const headers = Object.keys(xlData[0]);
        let emailHeader = headers.find(header => header.toLowerCase() === 'email');

        // Search for a survey with the same title
        const existingSurvey = await Survey_Info.findOne({ where: { title: title } });
        let surveyId;
        let questionIdMapping = {};  // Declare here to make it accessible later

        if (existingSurvey) {
            // Use the survey_id of the existing survey
            surveyId = existingSurvey.survey_id;

            // Populate the questionIdMapping from the existing questions in the database
            const existingQuestions = await Survey_Q.findAll({ where: { survey_id: surveyId } });
            existingQuestions.forEach(question => {
                questionIdMapping[question.prompt] = question.question_id;
            });

        } else {
            // Create a new survey since it doesn't exist
            const surveyData = {
                author: "brian.harder@army.mil",
                title: title,
                isCSVdata: true
            };

            const newSurvey = await Survey_Info.create(surveyData);
            surveyId = newSurvey.survey_id;

            let questionId = 0;
            for (let header of headers) {
                if (header !== emailHeader) {
                    questionId++;
                    const questionData = {
                        survey_id: surveyId,
                        question_id: questionId,
                        prompt: header,
                        type: 'text'
                    };

                    await Survey_Q.create(questionData);
                    questionIdMapping[header] = questionId;
                }
            }
        }



        for (let i = 0; i < xlData.length; i++) {
            const row = xlData[i];
            const email = row[emailHeader];  // Using the found email header
            let results = {};

            for (let header of headers) {
                if (header !== emailHeader) {  // Using the found email header
                    const questionId = questionIdMapping[header];
                    results[questionId] = row[header];
                }
            }

            const responseData = {
                survey_id: surveyId,
                email: email,
                results: results
            };
            console.log(responseData);
            await Survey_R.create(responseData);
        }



        res.send("File uploaded and processed successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while processing the file.");
    }
});

module.exports = router;
