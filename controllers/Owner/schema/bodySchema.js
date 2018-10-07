const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().required().lowercase(),
  email: Joi.string().email().required(),
  telephone: Joi.string().required().min(10),
  password: Joi.string(),
  salt: Joi.string(),
  role: Joi.string().valid(['OWNER'])
});

module.exports = schema;