const housingRoutes = require('./Housing');
const ownerRoutes = require('./Owner');
// setup authorization here
const {authorize} = require('../../../middlewares/auth');
const {wrapAsync} = require('../../../utilities');


const express = require('express');
const router = new express.Router();

router.use(
  '/housing', 
  wrapAsync(authorize({name: 'HOUSING'})),
  housingRoutes
);

router.use(
  '/owners',
  wrapAsync(authorize({name: 'OWNERS'})),
  ownerRoutes
);

module.exports = router;