const {
  validatePassword, 
  sign, 
  hashPassword,
  generateRandomFiveDigits
} = require('../utilities');
const config = require('../config')
const mongoose = require('mongoose');
const {omit} = require('lodash');
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
  name: { type: String, required: true },
  telephone: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  auth: {
    telephoneVerificationToken: Number,
    token: {type: String, default: ''},
    passwordResetToken: {type: String, default: ''},
  },
  verified: {type: Boolean, default: false},
  role: {type: String, default: 'OWNER', uppercase: true}
}, {timestamps: true});

ownerSchema.methods.validatePassword = function(password) {
  /* tiny line to help use with password validation */
  return validatePassword(password, this)
};

ownerSchema.methods.toJSON = function() {
  /* we clean up the object we are returning */
	const owner = this;
  const userObject = owner.toObject();
  
	return omit(userObject, ["password", "hash", "salt", "auth"])
}

ownerSchema.statics.findByIdAndToken = async function(id, token) {
  const Owner = this;
  
  const owner = Owner.findOne({
    _id: id, 'auth.token': token
  });
  
  return owner

}

ownerSchema.methods.generateAuthToken = async function() {

  const owner = this;
  
  // ------------- ---------------(1 minute) * (60)--> ( 24 hours) * 150 (5 months)*/
  // the reason being that we cant keep loggin users out of our mobile application
  // every six hours. So we make the token valid for 5 months.
  const fiveMonths = (Date.now()) + ((((1000 * 60) * 60) * 24) * 150);

  // token is valid for 6 hours
  const token = sign({
    _id: owner._id.toHexString(),
    role: owner.role,
    exp: fiveMonths
  }, config.BS_SECRET)
  
  owner.auth.token = token;
  
  await owner.save();
  
	return token
}

ownerSchema.pre('save', async function(next) {
  /* setup a pre save hook to hash and save password */
  const owner = this;
  const {password} = owner;

  if (owner.isModified('password')) { 
    owner.password = await hashPassword(password);
  }

  if (!owner.verified) {
    owner.auth.telephoneVerificationToken = generateRandomFiveDigits()
  }

  next()

});

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;