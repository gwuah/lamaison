const housingRoutes = require('./Housing');
const ownerRoutes = require('./Owner')

const express = require('express');
const router = new express.Router();

router.use(
  '/housing', 
  housingRoutes
);

router.use(
  '/owners', 
  ownerRoutes
);

module.exports = router;