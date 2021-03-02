const { validationResult } = require('express-validator');
const morgan = require('morgan');
const HttpStatusError = require('./http_status_error');

function validationErrorHandler(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const details = {
      validationErrors: errors.array(),
    };
    return next(
      new HttpStatusError(
        400,
        'Validation failed.',
        details,
      ),
    );
  }
  return next();
}

function errorHandler(err, req, res, _next) {
  req.error = err;

  if (err instanceof HttpStatusError) {
    const { message, status, details } = err;

    return res.status(status)
      .json({ error: message, status, details });
  }

  return res.status(500).json({
    error: 'Unexpected error occurred.',
    status: 500,
    details: {},
  });
}

function requestLogger() {
  morgan.token(
    'body',
    (req, _res) => {
      const { body } = req;
      if (typeof body === 'string') {
        if (body.length > 50) {
          return `\nbody: ${body.slice(0, 51)}...`;
        }
        return `\nbody: ${body}`;
      }
      const copy = { ...body };

      if (copy.content && copy.content.length > 50) {
        copy.content = `${copy.content.slice(0, 51)}...`;
      }
      return `\nbody: ${JSON.stringify(copy, null, 4)}`;
    },
  );

  morgan.token('error',
    (req, _res) => {
      return req.error
        ? `\nerror: ${JSON.stringify({ ...req.error }, null, 4)}`
        : '';
    });

  return morgan(
    '\n:method :url :status :res[content-length] '
    + '- :response-time ms :body :error',
    { skip: () => process.env.NODE_ENV === 'test' },
  );
}

module.exports = {
  validationErrorHandler,
  errorHandler,
  requestLogger,
};
