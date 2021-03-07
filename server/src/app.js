const express = require('express');
const cors = require('cors');
const pastesRouter = require('./routes/pastes_router');
const path = require('path');
const { errorHandler, requestLogger } = require('./utils/middleware');
const { Model } = require('objection');
const db = require('./database/db');
const swaggerDocs = require('../swagger.json');
const swaggerUi   = require('swagger-ui-express');

Model.knex(db);
const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger());

app.use('/api/pastes', pastesRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

app.use(errorHandler);

module.exports = app;
