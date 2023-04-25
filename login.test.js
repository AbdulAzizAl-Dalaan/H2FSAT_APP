const request = require('supertest');
const express = require('express');
const session = require('express-session');
const router = require('./routes/index');

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
  test('GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  test('GET /passlogin', async () => {
    const response = await request(app).get('/passlogin');
    expect(response.status).toBe(200);
  });

  test('GET /logout', async () => {
    const response = await request(app).get('/logout');
    expect(response.status).toBe(302);
  });

  test('GET /forgotpassword', async () => {
    const response = await request(app).get('/forgotpassword');
    expect(response.status).toBe(200);
  });

  
});