// const ControllerHandler = require('../../services/controllerHandler');
const {mapRoleToAdapter} = require('../../shared/Auth');
const {wrapAsync} = require('../../utilities');
const express = require('express');
const router = express.Router();

// all other routes that are not api related come here

router.get('/', (req, res) => {
  res.send('Main Application Endpoint')
})

// this route handles getting by id
router.post('/login', wrapAsync(async (req, res, next) => {
  let email, telephone;

  const validator = require('validator');
  const schema = require('./schema');
  const {runValidations} = require('../../utilities');
  const {ValidationFailedError} = require('../../shared/customErrors');
  // const {email_phone, password, role} = req.body;

  const {error, details} = await runValidations([
    schema.validate(req.body)
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
   var {email_phone, password, role} = details[0];
   
  }

  const Adapter = mapRoleToAdapter(role.toLowerCase());  

  if (validator.isEmail(email_phone)) {
    email = email_phone;
  } else if (validator.isMobilePhone(email_phone)) {
    telephone = email_phone
  }

  const query = {$or:[{email},{telephone}]};

  Adapter.findOneByQuery(query).then(async (user) => {
    if (user && user.validatePassword(password)) {
      user.generateAuthToken().then(token => {
        return res.status(200).json({user, token})
      }).catch(next)
    } else {
      return res.status(200).json({message: 'Invalid Login', code: 400})
    }
  }).catch(next)
}))



module.exports = router;