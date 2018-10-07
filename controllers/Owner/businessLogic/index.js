const UpdatePasswordSchema = require('../schema/updatePasswordSchema');
const {Owner:Adapter} = require('../../../services/Axel');
const ObjectIdSchema = require('../../../shared/vSchemas/objectId');
const BodySchemaUpdate = require('../schema/bodySchemaUpdate');
const BodySchema = require('../schema/bodySchema');
const Zeus = require('../../../services/Zeus');

const {sendEmail, emailTemplates} = require('../../../utilities');

/* i'm intentionally ignoring es6's ability to pass only the 
* key when both the key and value have the same name.
* Everything is configuration based, we will scale.
*/

class Controller extends Zeus {
  constructor(a,b) {
    super({...a},{...b})
  }

  async createAndSendEmail(body) {
    const emailsOfManagers = ['griffithawuah15@gmail.com']
  
    return this.create(body).then(result => {
      const {data:owner} = result;
      // if there are no domain managers,
      // just send back the data
      if (emailsOfManagers.length > 0) {
        sendEmail({
          to: emailsOfManagers,
          subject: 'New LaMaison owner',
          html: emailTemplates.customerOnboarding(owner)
        }).catch(error => {
          throw new Error(error)
        })
      }

      return result
    }).catch(error => {
      throw new Error(error)
    })
  }
}

const OwnerController = new Controller({
  EntityName: 'Owner',
  Adapter: Adapter
}, {
  BodySchema: BodySchema,
  ObjectIdSchema: ObjectIdSchema,
  BodySchemaUpdate: BodySchemaUpdate,
  UpdatePasswordSchema: UpdatePasswordSchema
});

// shorten that long thing ..lol
const CC = OwnerController;

/* So since the methods belonging to Zeus are promises,
* they tend to lose their context of this. So we have to
* bind Controller back to it, just like it's done in
* React.js. [idk if they return promises though]
*/

// hehe
function bindController(method) {
  return CC[method].bind(CC)
};

module.exports = {
  getById: CC.getById.bind(CC),
  create: CC.createAndSendEmail.bind(CC),
  getAll: CC.getAll.bind(CC),
  updateById: CC.updateById.bind(CC),
  updatePassword: CC.updatePassword.bind(CC),
  deleteById: CC.deleteById.bind(CC),
  resetPassword: CC.resetPassword.bind(CC),
  verifyPhoneNumber: CC.verifyPhoneNumber.bind(CC)
};

