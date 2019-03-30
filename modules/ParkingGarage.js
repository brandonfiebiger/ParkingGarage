const allSmallSpaces = [
  {id: 1, size: "small", vehicle_id: null, row: 1, level: 1},
  {id: 2, size: "small", vehicle_id: null, row: 1, level: 1},
  {id: 3, size: "small", vehicle_id: null, row: 1, level: 1},
  {id: 4, size: "small", vehicle_id: null, row: 1, level: 1},
  {id: 5, size: "small", vehicle_id: null, row: 1, level: 1},
  {id: 6, size: "small", vehicle_id: null, row: 1, level: 1},
  {id: 7, size: "small", vehicle_id: null, row: 1, level: 1},
]

const allMediumSpaces = [
  {id: 1, size: "medium", vehicle_id: null, row: 1, level: 1},
  {id: 2, size: "medium", vehicle_id: null, row: 1, level: 1},
  {id: 3, size: "medium", vehicle_id: null, row: 1, level: 1},
  {id: 4, size: "medium", vehicle_id: null, row: 1, level: 1},
  {id: 5, size: "medium", vehicle_id: null, row: 1, level: 1},
  {id: 6, size: "medium", vehicle_id: null, row: 1, level: 1},
  {id: 7, size: "medium", vehicle_id: null, row: 1, level: 1},
]

const allLargeSpaces = [
  [
  {id: 1, size: "large", vehicle_id: null, row: 0, level: 1},
  {id: 2, size: "large", vehicle_id: null, row: 0, level: 1},
  {id: 3, size: "large", vehicle_id: null, row: 0, level: 1},
  {id: 4, size: "large", vehicle_id: null, row: 0, level: 1},
  {id: 5, size: "large", vehicle_id: null, row: 0, level: 1},
  ],
  [
  {id: 1, size: "large", vehicle_id: null, row: 1, level: 1},
  {id: 2, size: "large", vehicle_id: null, row: 1, level: 1},
  {id: 3, size: "large", vehicle_id: null, row: 1, level: 1},
  {id: 4, size: "large", vehicle_id: null, row: 1, level: 1},
  {id: 5, size: "large", vehicle_id: null, row: 1, level: 1},
  ],
  
]


const ParkingSpace = require('./ParkingSpace');

class ParkingGarage {
  constructor() {
    this.largeSpaces = allLargeSpaces;
    this.mediumSpaces = allMediumSpaces;
    this.smallSpaces = allSmallSpaces;
    this.allParkedVehicles = [];

    this.vehiclesSpots = {};
    this.largeParkedVehiclesSpots = {};
  }

  handleAdd(space, vehicle) {
    this.allParkedVehicles.push(vehicle);
    const { id, size, row, level} = space;
    
    const parkingSpace = new ParkingSpace(id, size, row, level, vehicle.id);
    this.vehiclesSpots[parkingSpace.vehicle_id] = parkingSpace;
  }

  handleAddLargeVehicle(vehicle) {
    this.largeParkedVehiclesSpots[vehicle.id] = [];
    for (let row of this.largeSpaces) {
      if (row.length === 5) {
        for (let i = 0; i < 5; i++) {
          this.largeParkedVehiclesSpots[vehicle.id].push(row.pop());
        }
        this.allParkedVehicles.push(vehicle);
        return;
      }
    }
    console.log('there is no room for your large vehicle.')
  }

  addVehicle(vehicle) {
    vehicle.move();

    switch (vehicle.size) {
      case "small":
        if (this.smallSpaces.length) {
          this.handleAdd(this.smallSpaces.pop(), vehicle);
        } else if (this.mediumSpaces.length) {
          this.handleAdd(this.mediumSpaces.pop(), vehicle);
        } else {
          this.handleAdd(this.largeSpaces[0].pop(), vehicle);
        }
          break;
        case "medium":
          if (this.mediumSpaces) {
            this.handleAdd(this.mediumSpaces.pop(), vehicle);
          } else {
            this.handleAdd(this.largeSpaces.pop(), vehicle);
          }
          break;
        case "large":
          this.handleAddLargeVehicle(vehicle);
          this.largeSpaces.shift()
          break;
    }
    
      //Add fetch call to update parking spot in SQL database.
      //Add fetch call to add vehicle to vehicles table.
  }

  removeVehicle(id) {
    const foundVehicle = this.allParkedVehicles.find(vehicle => vehicle.id === id);

    this.allParkedVehicles = this.allParkedVehicles.filter(vehicle => vehicle.id !== id);
   
    if (!foundVehicle) {
      console.log('cannot find vehicle!');
      return;
    }
  
    if (foundVehicle.size === "large") {
      this.handleRemoveLargeVehicle(id);
      return;
    }
    
    const parkingSpot = this.vehiclesSpots[id];

    delete this.vehiclesSpots[id];
    
    switch (parkingSpot.size) {
      case "small":
        this.smallSpaces.push(parkingSpot);
        break;
      case "medium":
        this.mediumSpaces.push(parkingSpot);
        break;
      case "large":
        for (let arr of this.largeSpaces) {
          for (let space of arr) {
            if (space.row == parkingSpot.row) {
              arr.push(parkingSpot);
              return;
            }
          }
        }
        break;
      default:
        console.log('Could not find vehicle!');
    }
    //Add parkingSpot back to stack
    //Add fetch call to remove vehicle from database
    //Add fetch call to update parkingSpot using parkingSpotId
  }

  handleRemoveLargeVehicle(id) {
    const clearedSpots = this.largeParkedVehiclesSpots[id].map(spot => {
      spot.vehicle_id = null
      return spot;
    });
    delete this.largeParkedVehiclesSpots[id];
    this.largeSpaces.push(clearedSpots);
  }
}


module.exports = ParkingGarage;