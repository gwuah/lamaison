const {statusCodes} = require('../../utilities');
// } else if (error.name == 'JsonWebTokenError' && (error.message == 'invalid signature' || error.message == 'invalid token')) {

const ErrorHandler = function(){
  return function(error, req, res, next) {
    let message = '';
    console.log(error.stack)

    if (error.message == 'Authentication Failed') {
      return res.status(statusCodes.badRequest).json({
        code: statusCodes.badRequest,
        message: 'Authentication Failed'
      })
    } else if (error.message == 'Bad Request') {
      return res.status(statusCodes.badRequest).json({
        code: statusCodes.badRequest,
        message: 'Bad request'
      })
    } else if (error.message == 'Expired Token') {
      return res.status(statusCodes.badRequest).json({
        code: statusCodes.badRequest,
        message: 'Your token has expired. Login again :)'
      })
    } else if (error.name == 'JsonWebTokenError') {
      return res.status(statusCodes.badRequest).json({
        code: statusCodes.badRequest,
        message: 'Invalid Token'
      })
    } else if (error.name === 'UnauthorizedError' || error.message === 'UnauthorizedError') {
      return res.status(statusCodes.badRequest).json({
        code: statusCodes.badRequest,
        message: 'You are unauthorized to make this request'
      })
    } else if (error.name == 'Input Validation Error') {
      return res.status(statusCodes.badRequest).json({
        code: statusCodes.badRequest,
        validationErrors: error.errors,
        message: 'Input Validation Failed'
      })
    } else if (error.name === 'CastError') {
      message = 'Please provide a valid ObjectID'
    } else if (error.name === 'ValidationError') {
      message = error.message
    } else if (error.code === 11000) {
      message = 'The resource already exists';
    } else {
      return res.status(statusCodes.internalServerError).json({
        code: statusCodes.internalServerError,
        message: 'Request failed.'
      })
    }

    return res.status(statusCodes.badRequest).json({
      code: statusCodes.badRequest,
      message: message
    })
  }
}

module.exports = ErrorHandler