const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.objectId().error(new Error('ID not passed or is invalid'));
module.exports = schema;