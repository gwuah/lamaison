const Joi = require('joi');

const schema = Joi.object({
  password: Joi.string(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).options({
    language: {any:{allowOnly: 'passwords don\'t match'}}
  })
});

module.exports = schema;