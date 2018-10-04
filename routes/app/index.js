// const ControllerHandler = require('../../services/controllerHandler');
const express = require('express');
const router = express.Router();

// all other routes that are not api related come here

router.get('/', (req, res) => {
  res.send('Main Application Endpoint')
})



module.exports = router;