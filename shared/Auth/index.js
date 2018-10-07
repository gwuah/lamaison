const Axel = require('../../services/Axel');
const jwt = require('jsonwebtoken');
const {capitalise} = require('../../utilities');

const verify = (token, secret) => {
  return new Promise((res, rej) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return rej(error);
      }
      res(decoded)
    })
  })
}

const sign = (payload, secret) => {
  return jwt.sign(payload,secret).toString();
}
 
const mapResourceToRoles = {
  'HOUSING': [
    'OWNER',
  ]
}

const mapRoleToAdapter = function(role) {
  let userRole = capitalise(role);
  return Axel[userRole];
};


module.exports = {
  mapResourceToRoles,
  mapRoleToAdapter,
  verify,
  sign
};