class ParkingSpace {
  constructor(id, size, row, level, vehicle_id = null) {
    this.id = id;
    this.row = row;
    this.size = size;
    this.level = level
    this.vehicle_id = vehicle_id;
  }
}

module.exports = ParkingSpace;
