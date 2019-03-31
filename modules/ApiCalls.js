const fetch = require('node-fetch');


class ApiCalls {
  constructor() {

  }

  static async fetchSpaces() {
    try {
      const response = await fetch('http://localhost:5000/api/v1/spaces');
      const result = await response.json();
      return Promise.resolve(result);
    } catch (error) {
      console.log(error);
    }
  }

  static async fetchVehicles() {
    try {
      const response = await fetch('http://localhost:5000/api/v1/vehicles');
      const result = await response.json();
      return Promise.resolve(result);
    } catch (error) {
      console.log(error);
    }
  }


}

module.exports = ApiCalls;