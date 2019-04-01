const ParkingSpace = require('./ParkingSpace');
const fetch = require('node-fetch');
const ApiCalls = require('./ApiCalls');
const MotorCycle = require('./MotorCycle');
const Bus = require('./Bus');
const Car = require('./Car');


class ParkingGarage {
  constructor() {
    this.largeSpaces = [];
    this.mediumSpaces = [];
    this.smallSpaces = [];
    this.allParkedVehicles = [];

    this.vehiclesSpots = {};
    this.largeParkedVehiclesSpots = {};
  }

  async handleAdd(space, vehicle) {
    const { id, size, row, level} = space;
    const data = await ApiCalls.addVehicleToDataBase(vehicle);
    vehicle.id = data.id;
    this.allParkedVehicles.push(vehicle);
    const parkingSpace = new ParkingSpace(id, size, row, level, vehicle.id);
    const result = await ApiCalls.updateParkingSpaceWithVehicleId(parkingSpace);
    this.vehiclesSpots[parkingSpace.vehicle_id] = parkingSpace;
  }

  async handleAddLargeVehicle(vehicle) {
    const data = await ApiCalls.addVehicleToDataBase(vehicle)
    vehicle.id = data.id;
    this.largeParkedVehiclesSpots[vehicle.id] = [];
    for (let row of this.largeSpaces) {
      if (row.length === 5) {
        for (let i = 0; i < 5; i++) {
          let space = row.pop()
          space.vehicle_id = vehicle.id;
          await ApiCalls.updateParkingSpaceWithVehicleId(space)
          this.largeParkedVehiclesSpots[vehicle.id].push(space);
        }
        this.allParkedVehicles.push(vehicle);
        this.largeSpaces = this.largeSpaces.filter(row => row.length);
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
          break;
    }
    
      //Add fetch call to update parking spot in SQL database.
      //Add fetch call to add vehicle to vehicles table.
  }

  async removeVehicle(id) {
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

    try {

      let newSpots;
      switch (parkingSpot.size) {
        case "small":
        newSpots = await this.handleRemoveVehicleFromParkingSpaceFetch(parkingSpot)
        await ApiCalls.removeVehicleFromDataBase(foundVehicle.id);
        this.smallSpaces.push(...newSpots);
          break;
        case "medium":
          newSpots = await this.handleRemoveVehicleFromParkingSpaceFetch(parkingSpot)
          await ApiCalls.removeVehicleFromDataBase(foundVehicle.id);
          this.mediumSpaces.push(...newSpots);
          break;
        case "large":
          newSpots = await this.handleRemoveVehicleFromParkingSpaceFetch(parkingSpot)
          await ApiCalls.removeVehicleFromDataBase(foundVehicle.id);
          const singleSpot = newSpots.pop();
          for (let arr of this.largeSpaces) {
            for (let space of arr) {
              if (space.row == singleSpot.row) {
                arr.push(singleSpot);
                console.log(this.largeSpaces);
                return;
              }
            }
          }
          break;
        default:
        console.log('Could not find vehicle!');
      }
    
    } catch (error) {
      console.log(error);
    }

      // await ApiCalls.removeVehicleFromDataBase(foundVehicle.id);
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

  async getSpaces() {
    try {
      const spaces =  await ApiCalls.fetchSpaces();
      this.smallSpaces = this.cleanSpaces("small", spaces);
      this.mediumSpaces = this.cleanSpaces("medium", spaces);
      this.largeSpaces = this.cleanSpaces("large", spaces);
      this.handleAddOccupiedSpaces(spaces);

    } catch (error) {
      console.log(error)
    }
  }  

  handleAddOccupiedSpaces(spaces) {
    spaces = spaces.filter(space => space.vehicle_id);
    spaces.forEach(space => {
      const foundVehicle = this.allParkedVehicles.find(vehicle => vehicle.id === space.vehicle_id);

      if (space.size === "large" && foundVehicle.size === "large") {
        if (!this.largeParkedVehiclesSpots[space.vehicle_id]) {
          this.largeParkedVehiclesSpots[space.vehicle_id] = [space];
        } else {
          this.largeParkedVehiclesSpots[space.vehicle_id].push(space);
        }
      } else {
        this.vehiclesSpots[space.vehicle_id] = space;
      }
    })

  }

  cleanSpaces(size, spaces) {
    spaces = spaces.filter(space => space.size === size && !space.vehicle_id);
    spaces = spaces.map(space => {
      const {id, size, row, level, vehicle_id } = space;
      return new ParkingSpace(id, size, row, level, vehicle_id);
      })
      return size === "large" ? this.cleanLargeSpaces(spaces) : spaces;
  }

  cleanLargeSpaces(spaces)  {
    const checkObj = spaces.reduce((checkObj, space) => {
      if (!checkObj[space.row]) {
        checkObj[space.row] = [space];
      } else {
        checkObj[space.row].push(space);
      }

      return checkObj;
    }, {});

    let arrayOfLargeRows = [];

    for (let arr in checkObj) {
      arrayOfLargeRows.push(checkObj[arr]);
    }
    
    return arrayOfLargeRows;
  }

  async handleGetVehicles() {
    const vehicles = await ApiCalls.fetchVehicles()
    
    vehicles.forEach(vehicle => {
      if (vehicle.size === "small") {
        this.allParkedVehicles.push(new MotorCycle(vehicle.id));
      } else if (vehicle.size === "medium") {
        this.allParkedVehicles.push(new Car(vehicle.id));
      } else {
        this.allParkedVehicles.push(new Bus(vehicle.id));
      }
    })

  }

  async handleRemoveVehicleFromParkingSpaceFetch(parkingSpace) {
    try {
      const updatedSpots = await ApiCalls.removeVehicleFromParkingSpotInDataBase(parkingSpace);
      return updatedSpots.map(spot => {
        const { id, size, row, level, vehicle_id } = spot;
        return new ParkingSpace(id, size, row, level, vehicle_id);
      });

    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ParkingGarage;