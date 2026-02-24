const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');

// clear database file before each test to start fresh
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'todo.db');

beforeEach(() => {
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
  }
});

describe('Todo API', () => {
  test('creates and retrieves a todo', async () => {
    const newTodo = { title: 'buy milk', description: '2 liters' };
    const postRes = await request(app).post('/todos').send(newTodo);
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.title).toBe(newTodo.title);

    const getRes = await request(app).get(`/todos/${postRes.body.id}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.description).toBe(newTodo.description);
  });

  test('supports search with wildcard', async () => {
    await request(app).post('/todos').send({ title: 'test one' });
    await request(app).post('/todos').send({ title: 'another test' });
    const res = await request(app).get('/todos/search/all').query({ q: 'test' });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });
});
