const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object({
  name: Joi.string().required().lowercase(),
  location: Joi.object().keys({
    type: Joi.string().default('Point'),
    coordinates: Joi.array().required(),
    address: Joi.string().required()
  }),
  telephone: Joi.string().required().min(10),
  images: Joi.array().items([Joi.string()]).required(),
  owner: Joi.objectId().required(),
  averageCost: Joi.number(),
  about: Joi.string()
});
module.exports = schema;