const fetch = require('node-fetch');


class ApiCalls {
  constructor() {

  }

  static async fetchSpaces() {
    try {
      const response = await fetch('http://localhost:5000/api/v1/spaces');
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async fetchVehicles() {
    try {
      const response = await fetch('http://localhost:5000/api/v1/vehicles');
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async addVehicleToDataBase(vehicle) {
    try {
      const response = await fetch('http://localhost:5000/api/v1/vehicles', {
        method: 'POST',
        body: JSON.stringify({
          size: vehicle.size
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async updateParkingSpaceWithVehicleId(parkingSpace) {
    console.log(parkingSpace)
    try {
      const response = await fetch(`http://localhost:5000/api/v1/spaces/${parkingSpace.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          vehicle_id: parkingSpace.vehicle_id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async removeVehicleFromDataBase(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/vehicles/${id}`, {
        method: 'DELETE'
      })
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  static async removeVehicleFromParkingSpotInDataBase(parkingSpot) {
    const { id, row, size, level } = parkingSpot;
    try {
      const response = await fetch(`http://localhost:5000/api/v1/spaces/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          row,
          size,
          level,
          vehicle_id: null
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  }



}

module.exports = ApiCalls;