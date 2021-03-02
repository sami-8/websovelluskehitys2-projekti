const express = require('express');
const cors = require('cors');
const pastesRouter = require('./routes/pastes_router');
const {
  errorHandler, requestLogger,
} = require('./utils/middleware');
const { Model } = require('objection');
const db = require('./database/db');

Model.knex(db);
const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger());
app.use('/api/pastes', pastesRouter);
app.use(errorHandler);

module.exports = app;
