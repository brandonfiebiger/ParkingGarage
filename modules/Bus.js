const Vehicle = require('./Vehicle');

class Bus extends Vehicle {
  constructor(id) {
    super();
    this.id = id;
    this.size = "large";
  }
}

module.exports = Bus;