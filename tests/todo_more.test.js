const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'todo.db');

beforeEach(() => {
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
});

describe('Additional Todo API tests', () => {
  test('root and debug endpoints', async () => {
    const r = await request(app).get('/');
    expect(r.statusCode).toBe(200);
    expect(r.body.message).toMatch(/Welcome/);

    const d = await request(app).get('/debug');
    expect(d.statusCode).toBe(200);
    expect(d.body).toHaveProperty('secret');
    expect(d.body).toHaveProperty('api_key');
  });

  test('list empty todos returns empty array', async () => {
    const r = await request(app).get('/todos');
    expect(r.statusCode).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
    expect(r.body.length).toBe(0);
  });

  test('create without title returns 422', async () => {
    const r = await request(app).post('/todos').send({});
    expect(r.statusCode).toBe(422);
    expect(r.body.detail).toMatch(/title is required/);
  });

  test('update/delete non-existent todo return 404', async () => {
    const u = await request(app).put('/todos/999').send({ title: 'x' });
    expect(u.statusCode).toBe(404);
    const d = await request(app).delete('/todos/999');
    expect(d.statusCode).toBe(404);
  });

  test('create -> update -> delete lifecycle', async () => {
    const create = await request(app).post('/todos').send({ title: 'orig', description: 'one' });
    expect(create.statusCode).toBe(201);
    const id = create.body.id;

    const get = await request(app).get(`/todos/${id}`);
    expect(get.statusCode).toBe(200);
    expect(get.body.title).toBe('orig');

    const upd = await request(app).put(`/todos/${id}`).send({ title: 'changed', status: 'done' });
    expect(upd.statusCode).toBe(200);
    expect(upd.body.title).toBe('changed');
    expect(upd.body.status).toBe('done');

    const del = await request(app).delete(`/todos/${id}`);
    expect(del.statusCode).toBe(200);

    const getAfter = await request(app).get(`/todos/${id}`);
    expect(getAfter.statusCode).toBe(404);
  });

  test('pagination with limit and skip', async () => {
    await request(app).post('/todos').send({ title: 'a' });
    await request(app).post('/todos').send({ title: 'b' });
    await request(app).post('/todos').send({ title: 'c' });

    const r = await request(app).get('/todos').query({ limit: 2, skip: 1 });
    expect(r.statusCode).toBe(200);
    expect(r.body.length).toBe(2);
  });
});
