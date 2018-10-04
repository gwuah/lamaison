const utils = require('../../utilities');
const mongoose = require('mongoose');
const {omit} = require('lodash');
const Schema = mongoose.Schema;

const MongoMan = function(
  modelName, 
  schema, 
  options={sensitiveData: []}
) {
  this.name = modelName;
  this.schema = new Schema(schema);
  this.opts = options;
}

MongoMan.prototype.init = function() {
  this.pluginMethods();
  return mongoose.model(this.name, this.schema)
}

MongoMan.prototype.pluginMethod = function(name, method) {
  this.schema.methods[name] = method.bind(this.schema)
}

MongoMan.prototype.pluginStaticMethod = function(name, staticMethod) {
  const schema = this.schema;
  schema.statics[name] = staticMethod
}

MongoMan.prototype.pluginMethods = function() {
  /* I keep passing this.schema around*/
  /* Thing is, the this need me waa */

  const schema = this.schema;
  const {sensitiveData} = this.opts;

  schema.methods.toJson = function() {
    const userObject = schema.toObject();
	  return omit(userObject, sensitiveData)
  };

  schema.methods.validatePassword = function(password) {
    return utils.validatePassword(password, schema)
  }

  schema.statics.findTweet = function(id) {
    return new Promise((res, rej) => {
      const Model = this;
      Model.findById(id).then(res).catch(rej)
    })
  }

  this.schema.pre('save', async function(next) {
    /* setup a pre save hook to hash and save password */
    const schema = this;
    if (schema.password && schema.isModified('password')) { 
      schema.salt = utils.genSalt();
      schema.password = await utils.hashPassword(schema.password, schema.salt);  
    } else {
      // do nothing
    }

    next();
  });

}

module.exports = MongoMan;