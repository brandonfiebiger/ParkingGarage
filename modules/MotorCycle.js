const Vehicle = require('./Vehicle');

class MotorCycle extends Vehicle {
  constructor(id = null) {
    super();
    this.id = id;
    this.size = "small";
  }
}

module.exports = MotorCycle;


