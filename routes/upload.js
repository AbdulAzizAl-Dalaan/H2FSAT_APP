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
    const surveys = await Survey_Info.findAll();
    res.render('upload', { isAdmin, isUnitLeader, surveys });
});

router.post('/handle-upload', upload.single('file'), async (req, res) => {
    try {
        const uploaderEmail = req.session?.user?.email;
        if (!uploaderEmail) {
            return res.status(400).send("Uploader's email is not available.");
        }

        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const title = req.file.originalname.split('.').slice(0, -1).join('.');

        if (req.body.surveySelection === 'newSurvey') {
            const existingSurveyWithTitle = await Survey_Info.findOne({ where: { title: title } });
            if (existingSurveyWithTitle) {
                return res.status(400).send("A survey with this name already exists. Please choose a different file or rename the current one.");
            }
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheet_name_list = workbook.SheetNames;
        const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        if (!xlData.length) {
            return res.status(400).send("Uploaded file is empty.");
        }

        const dataProcessingResult = await processUploadData(req, uploaderEmail, xlData);
        if (dataProcessingResult !== true) {
            return res.status(400).send(dataProcessingResult);
        }

        res.redirect("/home/?msg=uploaded");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while processing the file.");
    }
});

async function processUploadData(req, uploaderEmail, xlData) {
    const title = req.file.originalname.split('.').slice(0, -1).join('.');
    const headers = Object.keys(xlData[0]);
    const emailHeader = headers.find(header => header.toLowerCase() === 'email');

    const selectedSurvey = req.body.surveySelection;
    let surveyId;
    let questionIdMapping = {};

    if (selectedSurvey !== "newSurvey") {
        surveyId = selectedSurvey;
        const existingQuestions = await Survey_Q.findAll({ where: { survey_id: surveyId } });
        const existingPrompts = existingQuestions.map(q => q.prompt);

        //checking if the questions match
        for (let header of headers) {
            if (header !== emailHeader && header.toLowerCase() !== 'timestamp' && !existingPrompts.includes(header)) {
                
                return `The questions in the uploaded file do not match with the existing survey. The question "${header}" is not present in the survey. Click back make sure you're uploading into the right survey. Also, check the file being uploaded is right. Otherwise, in the drop down select new survey.`;
            }
        }

        existingQuestions.forEach(question => {
            questionIdMapping[question.prompt] = question.question_id;
        });
    } else {
        const surveyData = {
            author: uploaderEmail,
            title: title,
            version: 1,
            isCSVdata: true
        };
        const newSurvey = await Survey_Info.create(surveyData);
        surveyId = newSurvey.survey_id;
        questionIdMapping = await createQuestions(headers, emailHeader, surveyId);
    }

    await saveResponses(xlData, headers, emailHeader, surveyId, questionIdMapping);
    return true;
}

async function createQuestions(headers, emailHeader, surveyId) {
    let questionIdMapping = {};
    let questionId = 0;
    for (let header of headers) {
        if (header !== emailHeader && header.toLowerCase() !== 'timestamp') {
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
    return questionIdMapping;
}

async function saveResponses(xlData, headers, emailHeader, surveyId, questionIdMapping) {
    for (let i = 0; i < xlData.length; i++) {
        const row = xlData[i];
        const email = row[emailHeader];
        let results = {};

        headers.filter(header => header !== emailHeader && header.toLowerCase() !== 'timestamp').forEach(header => {
            const questionId = questionIdMapping[header];
            results[questionId] = row[header];
        });

        const existingResponse = await Survey_D.findOne({ where: { survey_id: surveyId, email: email } });
        if (existingResponse) {
            existingResponse.results = { ...existingResponse.results, ...results };
            if(row['Timestamp']) existingResponse.timestamp = row['Timestamp'];  //saving timestamp
            await existingResponse.save();
        } else {
            const survey = await Survey_Info.findOne({ where: { survey_id: surveyId } });
            const responseData = {
                survey_id: surveyId,
                email: email,
                results: results,
                version: survey.version,
                timestamp: row['Timestamp']  //saving timestamp
            };
            await Survey_D.create(responseData);
        }
    }
}

module.exports = router;








