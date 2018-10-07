const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().lowercase(),
  email: Joi.string().email(),
  telephone: Joi.string().min(10),
  password: Joi.string(),
  salt: Joi.string(),
  role: Joi.string().valid(['OWNER'])
});

module.exports = schema;