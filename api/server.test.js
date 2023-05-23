// Write your tests here
const db = require('../data/dbConfig');
const server = require('./server');
const request = require('supertest');

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

afterAll(async () => {
  await db.destroy()
})

describe('sign up with no errors', () => {
  test('Responds with an error if there is no username', async () => {
    const response = await request(server).post('/api/auth/register').send({ password: 'test' })
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('username and password required')
  })
  test('Responds with an error if there is no password', async () => {
    const response = await request(server).post('/api/auth/register').send({ username: 'test' })
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('username and password required')
  })
})

describe('login with no errors', () => {
  test('Responds with an error if there is no username', async () => {
    const response = await request(server).post('/api/auth/register').send({ password: 'test' })
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('username and password required')
  })
  test('Responds with an error if there is no password', async () => {
    const response = await request(server).post('/api/auth/register').send({ username: 'test' })
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('username and password required')
  })
})

describe('Jokes endpoint', () => {
  test('Responds with correct error if no token', async () => {
    const response = await request(server).get('/api/jokes');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('token required');
  })
  test('Responds with jokes if valid token', async () => {
    await request(server).post('/api/auth/register').send({ username: 'placeholder', password: 'placeholder' });
    const initialResponse = await request(server).post('/api/auth/login').send({ username: 'placeholder', password: 'placeholder' });
    const token = initialResponse.body.token;
    const subsequentResponse = await request(server).get('/api/jokes').set({ authorization: token });
    expect(subsequentResponse.status).toBe(200);
  })
})
