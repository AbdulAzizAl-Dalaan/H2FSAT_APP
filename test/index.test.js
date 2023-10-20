const request = require('supertest');
const express = require('express');
const session = require('express-session');
const router = require('../routes/index');
const sinon = require('sinon');
const User = require('../models/User');  
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

describe('Routes', () => {
    let findByPkStub;
    let findOneStub;

    beforeEach(() => {
        //mock data
        const mockUserData = {
            email: 'test@example.com',
            password: 'testpassword',
            isAdmin: true,
            isUnitLeader: false,
        };

        //Stubing the findByPk method to always return mockUserData
        findByPkStub = sinon.stub(User, 'findByPk').resolves(mockUserData);

        
        findOneStub = sinon.stub(User, 'findOne').resolves(mockUserData);
    });

    afterEach(() => {
        
        findByPkStub.restore();
        findOneStub.restore();
    });

    it('GET /', async () => {
        const response = await request(app).get('/');
        assert.strictEqual(response.status, 200);
    });

    it('GET /passlogin', async () => {
        const response = await request(app).get('/passlogin');
        assert.strictEqual(response.status, 200);
    });

    it('POST /login - success', async () => {
        const response = await request(app).post('/login').send({
            email: 'test@example.com',
            password: 'testpassword'
        });
        assert.strictEqual(response.status, 302); //redirect on successful login
        //check if the redirect path is /home
    });

    

});
