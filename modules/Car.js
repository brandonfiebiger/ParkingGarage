const Vehicle = require('./Vehicle');

class Car extends Vehicle {
  constructor(id = null) {
    super();
    this.id = id;
    this.size = "medium";
  }
}

module.exports = Car;
