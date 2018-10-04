const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object({
  name: Joi.string().lowercase(),
  location: Joi.string(),
  telephone: Joi.string().min(10),
  geo: Joi.object().keys({
    longitude: Joi.number(),
    latitude: Joi.number()
  }),
  images: Joi.array().items([Joi.string()]),
  owner: Joi.objectId(),
  averageCost: Joi.number()
});

module.exports = schema;