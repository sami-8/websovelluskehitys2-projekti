const { Model } = require('objection');
const Knex = require('knex');
const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
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
  const paste  = await Paste.query().findById(id);

  if (!paste) {
    return res.status(404)
      .json({ error: `Paste with id ${id} doesn't exist.` });
  }

  return res.json(paste);
});

app.post('/api/pastes', async (req, res) => {
  const title    = req.body.title;
  const content  = req.body.content;
  const unlisted = req.body.unlisted || false;

  try {
    const id = nanoid(10);

    const newPaste = await Paste.query()
      .insert({ id, title, content, unlisted });

    return res.json(newPaste);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
