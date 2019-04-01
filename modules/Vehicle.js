class Vehicle {
  constructor(id) {
    this.id = id;
  }

  move() {
    console.log('vrooom');
  }

  start() {
    console.log('vroom vroom');
  }

  brake() {
    console.log('skrrrt');
  }
}

module.exports = Vehicle;

