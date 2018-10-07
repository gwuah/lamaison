const {authenticate} = require('../../middlewares/auth');
const {wrapAsync} = require('../../utilities');
const express = require('express');
const router = new express.Router();
const v1Router = require('./v1');

const whiteList = [{
  method: 'POST',
  url: '/owners',
  clean: true
}];

const authenticationMiddleware = authenticate({
  whiteList
});

router.use('/v1', wrapAsync(authenticationMiddleware), v1Router);

module.exports = router;