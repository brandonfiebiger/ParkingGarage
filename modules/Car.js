const Vehicle = require('./Vehicle');

class Car extends Vehicle {
  constructor(id) {
    super();
    this.id = id;
    this.size = "medium";
  }
}

module.exports = Car;
