class ValidationFailedError extends Error {
  constructor({name='Input Validation Error', message='Input Validation Failed', errors=[]}) {
    super(message)
    this.name = name;
    this.message = message;
    this.errors = errors;
  }
}

module.exports = {
  ValidationFailedError
}