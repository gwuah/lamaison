const housingRoutes = require('./Housing')

const express = require('express');
const router = new express.Router();

router.use(
  '/housing', 
  housingRoutes
);


module.exports = router;