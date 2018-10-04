const {runValidations, verify, hashPassword} = require('../../utilities');
const {ValidationFailedError} = require('../../shared/customErrors');
const config = require('../../config');

function Zeus({
  EntityName, 
  Adapter
}, schemas = {
  BodySchema,
  ObjectIdSchema,
  BodySchemaUpdate,
  updatePasswordSchema
}) {
  if (!EntityName) {
    throw new Error('Required <entityName> prop not present.')
  }
  if (!Adapter) {
    throw new Error('Required <Adapter> prop not present.')
  }
  this.db = Adapter;
  this.name = EntityName;

  /* plugin all those validation schema's */
  Object.keys(schemas).forEach(schema => {
    this[schema] = schemas[schema];
  })
};

Zeus.prototype.getById = async function(params) {
  const {id} = params;
  let cleanId = undefined;

  if (this.ObjectIdSchema) {
    const {error, details} = await runValidations([
      this.ObjectIdSchema.validate(id)
    ])
    
    if (error) {
      throw new ValidationFailedError({
        errors:details
      })
    } else {
      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
      cleanId = details[0]
    }
  }

  const data = await this.db.getById(cleanId);

  if (!data) {
    return {message: `${this.name} document not found.`, code: 404}
  }

  return {data:data, message: `${this.name} retrieved successfully`, code: 200}
}

Zeus.prototype.create = async function(body) {

  let cleanBody = {};

  if (this.BodySchema) {
    const {error, details} = await runValidations([
      this.BodySchema.validate(body, {abortEarly: false})
    ])

    if (error) {
      throw new ValidationFailedError({
        errors:details
      })
    } else {
      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
      cleanBody = details[0]
    }
  }

  const data = await this.db.create(cleanBody);

  return {data:data, message: `${this.name} created successfully`, code: 201}
}

Zeus.prototype.updateById = async function(params, body) {
  let {id} = params;
  var cleanBody = {};

  if (this.BodySchemaUpdate) {
    const {error, details} = await runValidations([
      this.ObjectIdSchema.validate(id),
      this.BodySchemaUpdate.validate(body, {abortEarly: false})
    ])

    if (error) {
      console.log(error)
      throw new ValidationFailedError({
        errors:details
      })
    } else {

      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
     var [cleanId, cleanBody] = details;
    }
  }

  const data = await this.db.updateById(cleanId,cleanBody);

  return {data:data, message: `${this.name} updated successfully`, code: 200}
}

Zeus.prototype.updatePassword = async function(params, body) {
  let {id} = params;
  let newPassword;

  if (this.UpdatePasswordSchema) {
    const {error, details} = await runValidations([
      this.ObjectIdSchema.validate(id),
      this.UpdatePasswordSchema.validate(body, {abortEarly: false})
    ])

    if (error) {
      throw new ValidationFailedError({
        errors:details
      })
    } else {

      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
     var [cleanId, cleanBody] = details;
     newPassword = cleanBody['password'];
    }
  }

  const data = await this.db.updatePassword(cleanId,newPassword);

  return {data:data, message: `${this.name} updated successfully`, code: 200}
}

Zeus.prototype.getAll = async function() {
  const data = await this.db.getAll();

  return {data:data, message: `${this.name} documents retrieved successfully`, code: 200}
}

Zeus.prototype.updateArrayProp = async function(propName, params, body) {
  let {id} = params;

  if (this.BodySchemaUpdate) {
    const {error, details} = await runValidations([
      this.ObjectIdSchema.validate(id),
      this.BodySchemaUpdate.validate(body, {abortEarly: false})
    ])

    if (error) {
      throw new ValidationFailedError({
        errors:details
      })
    } else {

      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
     var [cleanId, cleanBody] = details;
    }
  }

  const data = await this.db.updateArrayProp(cleanId, propName, cleanBody[propName]);

  return {data:data, message: `${this.name} updated successfully`, code: 200}

}

Zeus.prototype.queryByRelation = async function(relation, param) {
  let {id} = param;

  if (this.ObjectIdSchema) {
    const {error, details} = await runValidations([
      this.ObjectIdSchema.validate(id),
    ])

    if (error) {
      throw new ValidationFailedError({
        errors:details
      })
    } else {

      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
     var [cleanId] = details;
    }
  }

  let cleanQuery = {[relation]: cleanId}

  const data = await this.db.query(cleanQuery);

  return {data:data, message: `${this.name} related to ${relation} retrieved successfully`, code: 200}


}

Zeus.prototype.getCreateTools = async function(body) {

  let cleanBody = {};

  if (this.BodySchema) {
    const {error, details} = await runValidations([
      this.BodySchema.validate(body, {abortEarly: false})
    ])

    if (error) {
      throw new ValidationFailedError({
        errors:details
      })
    } else {
      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
      cleanBody = details[0]
    }
  }

  const data = {
    body: cleanBody,
    Model: this.db.Model
  }

  return data
}


Zeus.prototype.resetPassword = async function(query, body) {
  let {jwt} = query;
  
  let decoded = await verify(jwt, config.BS_SECRET);

  if (decoded.exp < Date.now()) {
    return {message: 'Reset Token Has Expired', code: 400}
  }

  if (!this.UpdatePasswordSchema) {
    throw new Error('Provide a UpdatepasswordSchema')
  }

  // run validations on user input
  const {error, details} = await runValidations([
    this.ObjectIdSchema.validate(decoded._id),
    this.UpdatePasswordSchema.validate(body, {abortEarly: false})
  ])

  if (error) {
    throw new ValidationFailedError({
      errors:details
    })
  }

  // check the source for runValidations
  // if you cant figure out what's going on.
  let [cleanId, cleanBody] = details;
  let {password:newPassword}= cleanBody;

  const user = await this.db.getById(cleanId);

  /* I am hashing the password here because, mongoose in it's own sense
  * has decided not to pass findByIdAndUpdate calls through 'save' hooks',
  * so the passwords end up getting stored in plain text. So I hash them here,
  * and then insert them. For the salt, it's already generated when the
  * first document is created, so we just extract it and use it to hash
  * the new password */

  const hashedPassword = await hashPassword(newPassword);

  if (user && user.auth.onboardToken == jwt) {
    const updatedUser = await this.db.updateById(cleanId, {
      password: hashedPassword
    });
    return {data:updatedUser, message: `${this.name} password reset successfully`, code: 200}
  } else if (!user) {
    return {message: `Bad Request`, code: 400}
  } else {
    return {message: `You are unauthorized to make this request`, code: 401}
  }
}

Zeus.prototype.deleteById = async function(params) {
  const {id} = params;
  let cleanId;

  if (this.ObjectIdSchema) {
    const {error, details} = await runValidations([
      this.ObjectIdSchema.validate(id)
    ])

    if (error) {
      throw new ValidationFailedError({
        errors:details
      })
    } else {
      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
      [cleanId] = details
    }
  }

  const deletedData = await this.db.deleteById(cleanId);

  return {message: `${this.name} document deleted successfully`, code: 200}

}

module.exports = Zeus;