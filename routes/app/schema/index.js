const Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object({
  email_phone: Joi.any().required(),
  password: Joi.string().required(),
  role: Joi.string().valid([
    'OWNER'
  ])
});

module.exports = schema;