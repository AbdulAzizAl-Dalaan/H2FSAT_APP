const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const User = require('../models/User');
const Survey_D = require('../models/Survey/Survey_D');
const Survey_Info = require('../models/Survey/Survey_Info');
const Survey_Q = require('../models/Survey/Survey_Q');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    const isAdmin = true;  
    const isUnitLeader = true;

    const surveys = await Survey_Info.findAll(); // Retrieve all surveys for dropdown

    res.render('upload', { isAdmin, isUnitLeader, surveys });
});

router.post('/handle-upload', upload.single('file'), async (req, res) => {
    try {
        const uploaderEmail = req.session.user.email;

        if (!uploaderEmail) {
            return res.status(400).send("Uploader's email is not available.");
        }
        console.log("Uploader's Email:", uploaderEmail);

        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const buffer = req.file.buffer;
        const workbook = xlsx.read(buffer, { type: 'buffer' });

        const sheet_name_list = workbook.SheetNames;
        const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        console.log("Excel Data:", xlData);

        const title = req.file.originalname.split('.').slice(0, -1).join('.');
        const headers = Object.keys(xlData[0]);
        let emailHeader = headers.find(header => header.toLowerCase() === 'email');

        const selectedSurvey = req.body.surveySelection; // Get selected survey from form
        let surveyId;
        let questionIdMapping = {};

        if (selectedSurvey !== "newSurvey") {
            surveyId = selectedSurvey;

            const existingQuestions = await Survey_Q.findAll({ where: { survey_id: surveyId } });
            existingQuestions.forEach(question => {
                questionIdMapping[question.prompt] = question.question_id;
            });
        } else {
            const surveyData = {
                author: uploaderEmail,
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
            const email = row[emailHeader];
            let results = {};

            for (let header of headers) {
                if (header !== emailHeader) {
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
            await Survey_D.create(responseData);
        }

        res.redirect("/home/?msg=uploaded");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while processing the file.");
    }
});

module.exports = router;
