const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object({
  name: Joi.string().lowercase(),
  location: Joi.object().keys({
    type: Joi.string().default('Point'),
    coordinates: Joi.array(),
    address: Joi.string()
  }),
  images: Joi.array().items([Joi.string()]),
  owner: Joi.objectId(),
  averageCost: Joi.number(),
  about: Joi.string()

});

module.exports = schema;