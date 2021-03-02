const Paste = require('../src/models/paste');
const db = require('../src/database/db');
const supertest = require('supertest');
const app = require('../src/app');
const api = supertest(app);

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

describe('GET-request to /api/pastes', () => {
  test('optional query parameter "page" has to be an integer', async () => {
    await api.get('/api/pastes?page=0').expect(200);
    await api.get('/api/pastes?page=1.23').expect(400);
    await api.get('/api/pastes?page=abc').expect(400);
  });

  test('optional query parameter "size" has to be an integer', async () => {
    await api.get('/api/pastes?size=0').expect(200);
    await api.get('/api/pastes?size=1.23').expect(400);
    await api.get('/api/pastes?size=abc').expect(400);
  });

  test('by default returns 10 pastes from page 0', async () => {
    const res = await api.get('/api/pastes')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const { pastes } = res.body;
    expect(pastes).toBeDefined();
    expect(pastes.results).toBeDefined();
    expect(pastes.results.length).toEqual(10);
  });

  test('with query parameter "size", returns that amount of results', async () => {
    const res = await api.get('/api/pastes?size=5')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const { pastes } = res.body;
    expect(pastes).toBeDefined();
    expect(pastes.results).toBeDefined();
    expect(pastes.results.length).toEqual(5);
  });
});

describe('POST-request to /api/pastes', () => {
  test('when successful, returns the new paste without delpassword.', async () => {
    const paste = {
      title: 'some title',
      content: 'some content',
      delpassword: '123',
    };
    const countBefore = await Paste.count();

    const res = await api.post('/api/pastes').send(paste)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const countAfter = await Paste.count();

    expect(countAfter).toEqual(countBefore + 1);

    const { id, title, content, delpassword } = res.body;
    expect(id).toBeDefined();
    expect(title).toBeDefined();
    expect(content).toBeDefined();
    expect(delpassword).not.toBeDefined();

    const pasteInDb = await Paste.query()
      .findOne({ title: paste.title });
    expect(pasteInDb).toBeDefined();
    expect(pasteInDb.content).toEqual(paste.content);
  });

  test('title and content are required and must be strings', async () => {
    await api.post('/api/pastes')
      .send({ content: 'content' }).expect(400);
    await api.post('/api/pastes')
      .send({ title: 'title' }).expect(400);
    await api.post('/api/pastes')
      .send({ title: 123, content: 'content' }).expect(400);
    await api.post('/api/pastes')
      .send({ title: 'title', content: 123 }).expect(400);
  });
});

describe('DELETE-request to /api/pastes/:id', () => {
  test('with correct password deletes a paste', async () => {
    const res = await api.post('/api/pastes')
      .send({ title: 't', content: 'c', delpassword: '123' });
    const { id } = res.body;
    const pasteInDbBefore = await Paste.query().findById(id);
    expect(pasteInDbBefore).toBeDefined();

    const countBefore = await Paste.count();

    await api.delete(`/api/pastes/${id}`)
      .send({ delpassword: '123' })
      .expect(204);

    const countAfter = await Paste.count();
    const pasteInDbAfter = await Paste.query().findById(id);

    expect(countAfter).toEqual(countBefore - 1);
    expect(pasteInDbAfter).not.toBeDefined();
  });

  test('with incorrect password, will not delete a paste', async () => {
    const res = await api.post('/api/pastes')
      .send({ title: 't', content: 'c', delpassword: '123' });
    const { id } = res.body;
    const pasteInDbBefore = await Paste.query().findById(id);
    expect(pasteInDbBefore).toBeDefined();

    const countBefore = await Paste.count();

    await api.delete(`/api/pastes/${id}`)
      .send({ delpassword: 'incorrect' })
      .expect(403);

    const countAfter = await Paste.count();
    const pasteInDbAfter = await Paste.query().findById(id);

    expect(countAfter).toEqual(countBefore);
    expect(pasteInDbAfter).toBeDefined();
  });
});

afterAll(async () => {
  await db.destroy();
});
