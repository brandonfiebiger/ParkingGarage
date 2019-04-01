const ApiCalls = require('./ApiCalls');
let fetch = require('node-fetch');
const mockSpaces = require('../../mockData/mockSpaces');
const mockVehicles = require('../../mockData/mockFetchVehicles')



describe('ApiCalls', () => {

  describe('fetchSpaces', () => {
    it('should call fetch with the correct params', async () => {
      fetch.mockResponse(JSON.stringify({ message: 'YATTA!' }));
      await ApiCalls.fetchSpaces();
      expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/v1/spaces");
    });

    it('should return and array of spaces', async () => {
      fetch.mockResponse(JSON.stringify(mockSpaces));
      const result = await ApiCalls.fetchSpaces();
      expect(result).toEqual(mockSpaces);
    });

    it('should throw an error if status is not ok', async () => {
      const expected = new Error('FetchError: invalid json response body at undefined reason: Unexpected token o in JSON at position 1');
      await fetch.mockResponse(Promise.reject('FetchError: invalid json response body at undefined reason: Unexpected token o in JSON at position 1'));
      await expect(ApiCalls.fetchSpaces()).rejects.toEqual(expected);
    });
  });

  describe('fetchVehicles', () => {
    it('should call fetch with the correct params', async () => {
      fetch.mockResponse(JSON.stringify({ message: 'YATTA!' }));
      await ApiCalls.fetchVehicles();
      expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/v1/vehicles");
    });

    it('should return vehicles on successful fetch', async () => {
      fetch.mockResponse(JSON.stringify(mockVehicles));
      const result = await ApiCalls.fetchVehicles();
      expect(result).toEqual(mockVehicles);
    });

    it('should throw an error if status is not ok', async () => {
      const expected = new Error('FetchError: invalid json response body at undefined reason: Unexpected token o in JSON at position 1');
      await fetch.mockResponse(Promise.reject('FetchError: invalid json response body at undefined reason: Unexpected token o in JSON at position 1'));
      await expect(ApiCalls.fetchVehicles()).rejects.toEqual(expected);
    });
  });

  describe('removeVehicleFromParkingSpotInDataBase', () => {

    it('should call fetch with the correct params', async () => {
      const mockSpot = {
        "id": 343,
        "size": "small",
        "row": 5,
        "level": 2,
        "vehicle_id": 34
     }
      fetch.mockResponse(JSON.stringify({ message: 'YATTA!' }));
      await ApiCalls.removeVehicleFromParkingSpotInDataBase(mockSpot);
      expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/v1/spaces/343", {
        method: 'PUT',
        body: JSON.stringify({
          row: mockSpot.row,
          size:mockSpot.size,
          level: mockSpot.level,
          vehicle_id: null
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    it('should return the space with vehicle_id set to null', async () => {
      const mockSpot = {
        "id": 343,
        "size": "small",
        "row": 5,
        "level": 2,
        "vehicle_id": 34
     };
     fetch.mockResponse(JSON.stringify({ id: 343, size: "small", row: 5, level: 2, vehicle_id: null }));
     const result = await ApiCalls.removeVehicleFromParkingSpotInDataBase(mockSpot);
     expect(result).toEqual({ id: 343, size: "small", row: 5, level: 2, vehicle_id: null })
    });
  });
});