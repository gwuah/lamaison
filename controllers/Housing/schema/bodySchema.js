const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object({
  name: Joi.string().required().lowercase(),
  location: Joi.string().required(),
  telephone: Joi.string().required().min(10),
  geo: Joi.object().keys({
    longitude: Joi.number(),
    latitude: Joi.number()
  }),
  images: Joi.array().items([Joi.string()]).required(),
  owner: Joi.objectId().required(),
  averageCost: Joi.number()
});
module.exports = schema;