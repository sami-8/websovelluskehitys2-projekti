class HttpStatusError extends Error {
  constructor(status, message, details = {}) {
    super(message);
    this.name = 'HttpStatusError';
    this.status = status;
    this.details = details;
  }
}

module.exports = HttpStatusError;
