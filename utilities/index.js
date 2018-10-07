const mongoose = require('mongoose');
const config = require('../config');
const crypto = require('crypto');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const sign = (payload, secret) => {
  return jwt.sign(payload,secret).toString();
}

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

const hashPassword = function(password) {
  const salt = genSalt();
  return new Promise((res, rej) => {
    crypto.pbkdf2(
      password, salt, 100000, 64, 
      'sha512', (err, derivedKey) => {
      if (err) {
        return rej(err)
      }
      res(derivedKey.toString('hex'));  // '3745e48...08d59ae'
    });
  })
}

// // async
// crypto.randomBytes(256, (err, buf) => {
//   if (err) throw err;
//   // ...
// });

const genSalt = function() {
  return crypto.randomBytes(16).toString('hex');
}

const generateRandomFiveDigits = function() {
  return (Math.floor(Math.random()*90000) + 10000)
}

function capitalise(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = {
  capitalise,
  generateRandomFiveDigits,
  hashPassword,
  genSalt,
  verify,
  sign,

  connectToDatabase: function(url) {
    return new Promise((res, rej) => {
      mongoose.connect(url, { useNewUrlParser: true })
      .then(() => {
        console.log(`<< Connected To Database ${url} >>`)
        res(url)
      }).catch(err => {
        console.log('Yiikes! 💔', err)
        rej(err)
      })
    })
  },

  setPassword: async function(password, self) {
    self.salt = crypto.randomBytes(16).toString('hex');
    self.hash = await hashPassword(password, self.salt);
    return true
  },

  validatePassword: async function(password, self) {
    const hash = await hashPassword(password, self.salt);
    return self.hash === hash;
  },
  
  runValidations: async function(queue) {
    const errorBus = [];
    const response = [];
    const validationQueue = queue;
  
    for (const validation of validationQueue) {
      const {error, value} = validation;
      if (error) {
        errorBus.push(error.message)
      } else {
        response.push(value)
      }
    };
  
    if (errorBus.length > 0) {
      return {
        error: true,
        details: errorBus
      }
    };

    return {
      error: false,
      details: response
    }
  },

  statusCodes: {
    success: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    serviceNotFound: 503,
    internalServerError: 500
  },
  extractValidProps: function({
    body, validProps=[]
  }) {
    const cleanObject = {};
    validProps.forEach(prop => {
      cleanObject[prop] = body[prop]
    });
    return cleanObject
  },

  sendEmail: function({to, html, subject}){
    return axios.post(config.EMAIL_API, {
      to, html, subject
    })
  },
  
  emailTemplates: {
    customerOnboarding: function(customer) {
      return `
        <html>
          <head>
          </head>
          <body>
            <h1>Customer Was Just Onboarded</h1>
            <p>A new customer just joined the service.</p>
            <h3>Find their details below</h3>
            <ul>
              <li>Name: ${customer.name}</li>
              <li>Email: ${customer.email}</li>
              <li>Phone: ${customer.telephone}</li>
              <li>SignUpTime: ${customer.createdAt}</li>
            </ul>
          </body>
        </html>
      `
    }
  },

  generateUniquePasswordUpdateLink(token) {
    const BASE_URL = config.getBaseUrl();
    return `${BASE_URL}/superadmins/onboard/?jwt=${token}`
  },

  wrapAsync: function(fn) {  
    return function(req, res, next) {
      // Make sure to `.catch()` any errors and pass them along to the `next()`
      // middleware in the chain, in this case the error handler.
      fn(req, res, next).catch(next);
    };
  }

}