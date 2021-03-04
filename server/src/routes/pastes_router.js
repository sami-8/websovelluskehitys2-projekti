const express = require('express');
const { check, query } = require('express-validator');
const { raw } = require('objection');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Paste = require('../models/paste');
const { validationErrorHandler } = require('../utils/middleware');
const HttpStatusError = require('../utils/http_status_error');

const router = express.Router();

router.get('/',
  query('page').optional({ checkFalsy: true }).isInt(),
  query('size').optional({ checkFalsy: true }).isInt(),
  validationErrorHandler,
  async (req, res) => {
    const page = req.query.page || 0;
    const size = req.query.size || 10;

    const pastes = await Paste.query()
      .where({ unlisted: false })
      .page(page, size);

    return res.json({ pastes });
  });

router.get('/random', async (req, res) => {
  const paste = await Paste.query()
    .where({ unlisted: false })
    .orderBy(raw('RANDOM()'))
    .limit(1);

  return res.json(paste);
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const paste  = await Paste.query().findById(id);

  if (!paste) {
    return next(
      new HttpStatusError(
        404, `Paste with id "${id}" does not exist.`,
      ),
    );
  }

  return res.json(paste);
});

router.get('/:id/raw', async (req, res) => {
  res.set('Content-Type', 'text/plain');

  const { id } = req.params;
  const paste  = await Paste.query().findById(id);

  if (!paste) {
    return res.status(404)
      .send(`Paste with id "${id}" does not exist.`);
  }
  return res.send(paste.content);
});

router.delete('/:id',
  check('delpassword', 'delpassword missing.').exists(),
  check('delpassword', 'delpassword should be a string.').isString(),
  validationErrorHandler,
  async (req, res, next) => {
    const { id } = req.params;
    const { delpassword } = req.body;
    const paste  = await Paste.query().findById(id);

    if (!paste) {
      return next(
        new HttpStatusError(
          404, `Paste with id "${id}" does not exist.`,
        ),
      );
    }
    const correctPassword = paste.delpassword
      && await bcrypt.compare(delpassword, paste.delpassword);

    if (!correctPassword) {
      return next(
        new HttpStatusError(
          403, 'Wrong password or the paste cannot be deleted.',
        ),
      );
    }
    await Paste.query().deleteById(id);
    return res.status(204).end();
  });

router.post('/',
  check('title').exists().isString(),
  check('content').exists().isString(),
  check('unlisted').optional().isBoolean(),
  check('delpassword').optional().isString(),
  validationErrorHandler,
  async (req, res, next) => {
    const { title, content, unlisted, delpassword } = req.body;

    const paste = {
      id: nanoid(10),
      title,
      content,
      unlisted: unlisted || false,
      delpassword: delpassword
        ? await bcrypt.hash(req.body.delpassword, 10)
        : null,
    };

    try {
      const savedPaste = await Paste.query().insert(paste);

      return res.json(savedPaste);
    } catch (error) {
      return next(error);
    }
  });

router.post('/raw',
  express.text({ type: '*/*' }),
  async (req, res, next) => {
    res.set('Content-Type', 'text/plain');
    const content = req.body;

    const paste = {
      id: nanoid(10),
      content,
      title: content.length > 9
        ? `${content.slice(0, 10)}...`
        : content,
      unlisted: true,
    };
    try {
      const savedPaste = await Paste.query().insert(paste);
      const url = `${req.protocol}://${req.get('host')}`
        + `/api/pastes/${savedPaste.id}/raw\n`;

      return res.send(url);
    } catch (error) {
      return next(error);
    }
  });

module.exports = router;
