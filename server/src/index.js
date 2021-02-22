const { Model } = require('objection');
const Knex = require('knex');
const express = require('express');
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

app.get('/api/pastes', async (req, res) => {
  const page = req.query.page || 0;
  const size = req.query.size || 10;

  const pastes = await Paste.query()
    .where({ unlisted: false })
    .page(page, size);

  return res.json({ pastes });
});

app.get('/api/pastes/:id', async (req, res) => {
  const { id } = req.params;

  const paste = await Paste.query().findById(id);
  return res.json(paste);
});

app.get('*', (req, res) => {
  res.send('hello world');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
