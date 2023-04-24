const request = require('supertest');
const app = require('./app'); 

let agent;

beforeAll(async () => {
  // Log in with a fake user
  agent = request.agent(app);
  await agent.post('/login').send({ username: 'test', password: 'test' });
});

test('GET /fms should return 200 status', async () => {
  const response = await agent.get('/fms');
  expect(response.statusCode).toBe(200);
});

test('POST /fms/submit should return 302 status', async () => {
  const response = await agent.post('/fms/submit').send({
    deep_squat: 2,
    hurdle_step: 2,
    inline_lunge: 2,
    shoulder_mobility: 2,
    active_straight_leg_raise: 2,
    trunk_stability_pushup: 2,
    rotary_stability: 2,
    fms_grader: 'Test Grader',
  });

  expect(response.statusCode).toBe(302);
  expect(response.headers.location).toBe('/home/?msg=success');
});