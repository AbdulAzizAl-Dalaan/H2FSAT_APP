const request = require('supertest');
const express = require('express');
const app = express();
const session = require('express-session');
const cpaRouter = require('./routes/cpa');


app.use(
  session({
    secret: 'test secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);


app.use(cpaRouter);

describe('CPA Routes', () => {
  beforeEach(() => {
    
    const fakeSession = {
      user: {
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        unit: 'Test Unit',
        rank: 'Test Rank',
        isAdmin: false,
        isUnitLeader: false,
      },
    };

    app.use((req, res, next) => {
      req.session = fakeSession;
      next();
    });
  });

  test('GET /cpa should return 200 status', async () => {
    const response = await request(app).get('/cpa');
    expect(response.statusCode).toBe(200);
  });

  
});