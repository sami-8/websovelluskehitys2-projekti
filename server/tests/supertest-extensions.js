const Test = require('supertest').Test;

Test.prototype.expectErrorMessage = function (message) {
  return this.expect((res) => {
    const { body } = res;

    if (!body.error) {
      return Error(
        'Expected an error, but the response did not return any.',
      );
    }
    if (body.error !== message) {
      return Error(
        `Expected error message "${message}", got "${body.error}"`,
      );
    }
    return false;
  });
};

Test.prototype.expectValidationErrorMessage = function (message) {
  return this.expect((res) => {
    const { body } = res;
    const { validationErrors } = body.details;

    if (!validationErrors) {
      return Error(
        'Expected validation errors, but the response did not return any.',
      );
    }
    if (!validationErrors.some(({ msg }) => msg === message)) {
      return Error(
        `Expected validation error message "${message}", `
        + 'but it does not exist in the validation errors array:'
        + `\n errors: ${JSON.stringify(validationErrors, null, 2)}`,
      );
    }
    return false;
  });
};
