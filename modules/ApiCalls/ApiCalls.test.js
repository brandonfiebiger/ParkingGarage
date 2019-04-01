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

    it('should throw an error if the status is not ok', async () => {
      const expected = new Error('FetchError: invalid json response body at undefined reason: Unexpected token o in JSON at position 1');
      await fetch.mockResponse(Promise.reject('FetchError: invalid json response body at undefined reason: Unexpected token o in JSON at position 1'));
      await expect(ApiCalls.removeVehicleFromParkingSpotInDataBase(32)).rejects.toEqual(expected);
    })
  });

  describe('removeVehicleFromDatabas', () => {
    it('should call fetch with the correct parameters', async () => {
      fetch.mockResponse(JSON.stringify({ message: 'YATTA!' }));
      await ApiCalls.removeVehicleFromDataBase(20);
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/v1/vehicles/20', {method: "DELETE"})
    });

    it('should return a success message', async () => {
      fetch.mockResponse(JSON.stringify('success'))
      const result = await ApiCalls.removeVehicleFromDataBase(20);
      expect(result).toEqual('success');
    });

    it('should throw an error if the status is not ok', async () => {
      const expected = new Error('FetchError: invalid json response body at undefined reason: Unexpected token o in JSON at position 1');
      await fetch.mockResponse(Promise.reject('FetchError: invalid json response body at undefined reason: Unexpected token o in JSON at position 1'));
      await expect(ApiCalls.removeVehicleFromDataBase(32)).rejects.toEqual(expected);
    });
  });

  describe('updateParkingSpaceWithVehicleId', () => {
    it('should call fetch with the correct parameters', async () => {
      const mockParkingSpace = { 
        id: 400,
        size: 'large',
        row: 2,
        level: 3,
        vehicle_id: 55,
        created_at: '2019-04-01T01:45:02.080Z',
        updated_at: '2019-04-01T01:45:02.080Z' 
      };
      fetch.mockResponse(JSON.stringify({ message: 'YATTA!' }));
      await ApiCalls.updateParkingSpaceWithVehicleId(mockParkingSpace);
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/v1/vehicles/20', {"method": "DELETE"})
    });

    it('should return what comes back from fetch', async () => {
      const mockParkingSpace = { 
        id: 400,
        size: 'large',
        row: 2,
        level: 3,
        vehicle_id: 55,
        created_at: '2019-04-01T01:45:02.080Z',
        updated_at: '2019-04-01T01:45:02.080Z' 
      };
      fetch.mockResponse(JSON.stringify({ message: 'YATTA!' }));
      const result = await ApiCalls.updateParkingSpaceWithVehicleId(mockParkingSpace);
      expect(result).toEqual({message: "YATTA!"})
    });

    it('should throw an error if status is not ok', async () => {
      const mockParkingSpace = { 
        id: 400,
        size: 'large',
        row: 2,
        level: 3,
        vehicle_id: 55,
        created_at: '2019-04-01T01:45:02.080Z',
        updated_at: '2019-04-01T01:45:02.080Z' 
      };
      const expected = new Error('FetchError: invalid json response body at undefined reason: Unexpected token o in JSON at position 1');
      await fetch.mockResponse(Promise.reject('FetchError: invalid json response body at undefined reason: Unexpected token o in JSON at position 1'));
      await expect(ApiCalls.updateParkingSpaceWithVehicleId(mockParkingSpace)).rejects.toEqual(expected);
    });
  });

  describe('addVehicleToDataBase', () => {
    it('should call fetch with the correct parameters', async () => {
      fetch.mockResponse(JSON.stringify({ 
        id: 50,
        size: 'small',
        created_at: '2019-04-01T03:49:14.340Z',
        updated_at: '2019-04-01T03:49:14.340Z' }));
      const mockVehicle = {size: 'small' }
      await ApiCalls.addVehicleToDataBase(mockVehicle)
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/v1/vehicles', {"body": "{\"size\":\"small\"}", "headers": {"Content-Type": "application/json"}, "method": "POST"})
    });

    it('should return a vehicle object upon successful fetch', async () => {
      const response ={ 
        id: 50,
        size: 'small',
        created_at: '2019-04-01T03:49:14.340Z',
        updated_at: '2019-04-01T03:49:14.340Z' }

      fetch.mockResponse(JSON.stringify(response));
      const mockVehicle = {size: 'small' };
      const result = await ApiCalls.addVehicleToDataBase(mockVehicle);
      expect(result).toEqual(response);
    });

    it.skip('should throw an error if response is not ok', async () => {
      const mockVehicle = {size: 'small' };

      const expected = new Error('FetchError: invalid json response body at undefined reason: Unexpected token o in JSON at position 1');
      await fetch.mockResponse(Promise.reject('FetchError: invalid json response body at undefined reason: Unexpected token o in JSON at position 1'));
      await expect(ApiCalls.addVehicleToDataBase(mockVehicle)).rejects.toEqual(expected);
    })
  });
});