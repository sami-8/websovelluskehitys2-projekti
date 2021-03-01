const { Model, raw } = require('objection');
const Knex = require('knex');
const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Paste = require('./models/Paste');

const knex = Knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: 'sqlite.db',
  },
});
Model.knex(knex);

const app = express();

app.use(express.json());
app.use(cors());

app.get('/test/api/pastes', async (req, res) => {
  const pastes = await Paste.query();
  return res.json({ pastes });
});

app.get('/api/pastes', async (req, res) => {
  const page = req.query.page || 0;
  const size = req.query.size || 10;

  const pastes = await Paste.query()
    .where({ unlisted: false })
    .page(page, size);

  return res.json({ pastes });
});

app.get('/api/pastes/random', async (req, res) => {
  const paste = await Paste.query()
    .where({ unlisted: false })
    .orderBy(raw('RANDOM()'))
    .limit(1);

  return res.json(paste);
});

app.get('/api/pastes/:id', async (req, res) => {
  const { id } = req.params;
  const paste  = await Paste.query().findById(id);

  if (!paste) {
    return res.status(404)
      .json({ error: `Paste with id ${id} doesn't exist.` });
  }

  return res.json(paste);
});

app.delete('/api/pastes/:id', async (req, res) => {
  const { id } = req.params;
  const { delpassword } = req.body;
  const paste  = await Paste.query().findById(id);

  if (!delpassword) {
    return res.status(400)
      .json({ error: 'delpassword is required.' });
  }
  if (!paste) {
    return res.status(404)
      .json({ error: `Paste with id ${id} doesn't exist.` });
  }
  const correctPassword = paste.delpassword
    && await bcrypt.compare(delpassword, paste.delpassword);

  if (!correctPassword) {
    return res.status(403)
      .json({
        error: 'Wrong password or the paste can\'t '
        + 'be deleted.',
      });
  }

  await Paste.query().deleteById(id);
  return res.status(204).end();
});

app.get('/api/pastes/:id/raw', async (req, res) => {
  const { id } = req.params;
  const paste  = await Paste.query().findById(id);

  if (!paste) {
    return res.status(404)
      .send(`Paste with id ${id} doesn't exist.`);
  }

  res.set('Content-Type', 'text/plain');
  return res.send(paste.content);
});

app.post('/api/pastes', async (req, res) => {
  const title       = req.body.title;
  const content     = req.body.content;
  const unlisted    = req.body.unlisted || false;
  const delpassword = req.body.delpassword
    ? await bcrypt.hash(req.body.delpassword, 10)
    : null;

  try {
    const id = nanoid(10);

    const newPaste = await Paste.query()
      .insert({ id, title, content, unlisted, delpassword });

    return res.json(newPaste);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
