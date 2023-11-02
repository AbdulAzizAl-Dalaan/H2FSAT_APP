const request = require('supertest');
const express = require('express');
const session = require('express-session');
const router = require('../routes/upload');  // Adjust the path to your upload.js
const sinon = require('sinon');
const Survey_Info = require('../models/Survey/Survey_Info');
const Survey_Q = require('../models/Survey/Survey_Q');
const Survey_D = require('../models/Survey/Survey_D');
const assert = require('chai').assert;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'test secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(router);

describe('Upload Routes', () => {
    let findOneSurveyInfoStub;
    let findAllSurveyQStub;
    let createSurveyInfoStub;
    let createSurveyQStub;
    let createSurveyDStub;

    beforeEach(() => {
        // Mock data for Survey_Info
        const mockSurveyInfo = {
            survey_id: 1,
            author: 'test@example.com',
            title: 'test_title',
            isCSVdata: true
        };

        // Mock data for Survey_Q
        const mockSurveyQ = {
            survey_id: 1,
            question_id: 1,
            prompt: 'test_prompt',
            type: 'text'
        };

        // Stubbing methods for your upload routes
        findOneSurveyInfoStub = sinon.stub(Survey_Info, 'findOne').resolves(mockSurveyInfo);
        findAllSurveyQStub = sinon.stub(Survey_Q, 'findAll').resolves([mockSurveyQ]);
        createSurveyInfoStub = sinon.stub(Survey_Info, 'create').resolves(mockSurveyInfo);
        createSurveyQStub = sinon.stub(Survey_Q, 'create').resolves(mockSurveyQ);
        createSurveyDStub = sinon.stub(Survey_D, 'create').resolves();  // Resolving with no data for simplicity.

    });

    afterEach(() => {
        // Restore the stubs after each test
        findOneSurveyInfoStub.restore();
        findAllSurveyQStub.restore();
        createSurveyInfoStub.restore();
        createSurveyQStub.restore();
        createSurveyDStub.restore();
    });

    it('GET /upload', async () => {
        const response = await request(app).get('/upload');
        assert.strictEqual(response.status, 200);
        assert.include(response.text, 'Excel Upload');
    });

    it('POST /upload/handle-upload - no file uploaded', async () => {
        const response = await request(app).post('/upload/handle-upload').send();
        assert.strictEqual(response.status, 400);
        assert.strictEqual(response.text, 'No file uploaded.');
    });

    // Add more tests as required. For example, you might want a test for a successful file upload and its data processing.

});

