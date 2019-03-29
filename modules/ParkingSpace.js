class ParkingSpace {
  constructor(id, size, row, level, vehicle_id = null, index) {
    this.id = id;
    this.row = row;
    this.size = size;
    this.vehicle_id = vehicle_id;
    this.index = index;
  }
}

module.exports = ParkingSpace;
