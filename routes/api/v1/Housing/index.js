const ControllerHandler = require('../../../../services/controllerHandler');
const controller = require('../../../../controllers/Housing');
const express = require('express');
const router = express.Router();

// checkout the source for ControllerHandler if you
// dont understand what's going on.
const c = ControllerHandler;

// this route handles getting by id
router.get('/:id', c(controller.getById, 
  (req, res, next) => [req.params]
));

// this handles updating by id
router.put('/:id', c(controller.updateById, 
  (req, res, next) => [req.params, req.body]
));

// this handles deleting by id
router.delete('/:id', c(controller.deleteById, 
  (req, res, next) => [req.params]
));

// this route handles creation of new user
router.post('/', c(controller.create, 
  (req, res, next) => [req.body]
));

// this route handles getting all customer
router.get('/', c(controller.getAll, 
  (req, res, next) => [req.query]
));


// export router to global scope
module.exports = router;