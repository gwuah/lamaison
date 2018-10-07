const OwnerModel = require('../../../models/Owner');
const Nexus = require('../../../shared/Nexus');

class Owner extends Nexus {
  constructor(Model) {
    super(Model)
  }

  /* so from here, we can extend it and implement any new
  * method we desire. []
  */
}

module.exports = new Owner(OwnerModel);