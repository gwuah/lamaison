const HousingModel = require('../../../models/Housing');
const Nexus = require('../../../shared/Nexus');

class Housing extends Nexus {
  constructor(Model) {
    super(Model)
  }

  /* so from here, we can extend it and implement any new
  * method we desire. []
  */
}

module.exports = new Housing(HousingModel);