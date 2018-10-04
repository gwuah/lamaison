const {Housing:Adapter} = require('../../../services/Axel');
const ObjectIdSchema = require('../../../shared/vSchemas/objectId');
const BodySchemaUpdate = require('../schema/bodySchemaUpdate');
const BodySchema = require('../schema/bodySchema');
const Zeus = require('../../../services/Zeus');


/* i'm intentionally ignoring es6's ability to pass only the 
* key when both the key and value have the same name.
* Everything is configuration based, we will scale.
*/

const HousingController = new Zeus({
  EntityName: 'Housing',
  Adapter: Adapter
}, {
  BodySchema,
  ObjectIdSchema,
  BodySchemaUpdate,
});

/* So since the methods belonging to Zeus are promises,
* they tend to lose their context of this. So we have to
* bind Controller back to it, just like it's done in
* React.js. [idk if they return promises though]
*/

// shorten that long thing ..lol
const CC = HousingController;

module.exports = {
  create: CC.create.bind(CC),
  getAll: CC.getAll.bind(CC),
  getById: CC.getById.bind(CC),
  updateById: CC.updateById.bind(CC),
  deleteById: CC.deleteById.bind(CC)
};

