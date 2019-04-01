const ParkingGarge = require('./ParkingGarage');
const mockSpacesData = require('../../mockData/mockSpaces');
const mockSmallSpacesData = require('../../mockData/mockSmallSpaces');
const mockMediumSpacesData = require('../../mockData/mockMediumSpaces');
const mockLargeSpacesData = require('../../mockData/mockLargeSpaces');
const mockFetchVehiclesData = require('../../mockData/mockFetchVehicles');
const mockHandleGetVehiclesResult = require('../../mockData/mockHandleGetVehiclesResult');
const mockVehiclesSpots = require('../../mockData/mockVehiclesSpots');
const mockLargeVehiclesSpots = require('../../mockData/mockLargeParkedVehiclesSpots');
const mockSpacesWithParkedVehicles = require('../../mockData/mockSpacesWithParkedVehicles');
const mockResultFromRemoveSmallVehicle = require('../../mockData/mockResultFromRemoveSmallVehicle');
const mockResultFromRemoveMediumVehicle = require('../../mockData/mockResultFromRemoveMediumVehicle');
const mockResultFromRemoveLargeVehicle = require('../../mockData/mockResultFromRemoveLargeVehicle');
const mockHandleRemoveLargeVehicleResult = require('../../mockData/mockHandleRemoveLargeVehicleResult');
const mockSpacesWithSmallVehicleInLargeSpot = require('../../mockData/mockSpacesWithSmallVehicleInLargeSpot');
const mockVehiclesWithSmallVehicleInLargeSpot = require('../../mockData/mockVehiclesWithSmallVehicleInLargeSpot');
const mockRemoveSmallVehicleFromLargeSpaceResult = require('../../mockData/mockRemoveSmallVehicleFromLargeSpaceResult');
const mockSpacesWithNoMediumSpots = require('../../mockData/mockSpacesWithNoMediumSpots');
const onlyLargeSpaces = require('../../mockData/onlyLargeSpaces');
const onlyMediumSpaces = require('../../mockData/onlyMediumSpaces');
const MotorCycle = require('../MotorCycle');
const Car = require('../Car');
const Bus = require('../Bus');''
const ApiCalls = require('../ApiCalls/ApiCalls');



describe('ParkingGarage', () => {
  let garage;

  beforeEach(() => {
    garage = new ParkingGarge()
    ApiCalls.fetchSpaces = jest.fn().mockImplementation(() => mockSpacesData);
    ApiCalls.fetchVehicles = jest.fn().mockImplementation(() => mockFetchVehiclesData);
  })
  
  
  describe('getSpaces', () => {
    it('should fetch all parking spaces and populate small, medium and large spaces', async () => {
      await garage.getSpaces();
      expect(garage.smallSpaces.length).toEqual(39);
      expect(garage.mediumSpaces.length).toEqual(31);
      expect(garage.largeSpaces.length).toEqual(6);
    });
    
    it('should call cleanSpaces with value of small and spaces and set value of smallSpaces', async () => {
      garage.cleanSpaces = jest.fn().mockImplementation(() => mockSmallSpacesData)
      await garage.getSpaces();
      expect(garage.cleanSpaces).toHaveBeenCalledWith("small", mockSpacesData);
      expect(garage.smallSpaces).toEqual(mockSmallSpacesData);
    });

    it('should call cleanSpaces with value of medium and spaces and set value of mediumSpaces', async () => {
      garage.cleanSpaces = jest.fn().mockImplementation(() => mockMediumSpacesData)
      await garage.getSpaces();
      expect(garage.cleanSpaces).toHaveBeenCalledWith("medium", mockSpacesData);
      expect(garage.mediumSpaces).toEqual(mockMediumSpacesData);
    });

    it('should call cleanSpaces with value of large and spaces and set value of largeSpaces', async () => {
      garage.cleanSpaces = jest.fn().mockImplementation(() => mockLargeSpacesData)
      await garage.getSpaces();
      expect(garage.cleanSpaces).toHaveBeenCalledWith("large", mockSpacesData);
      expect(garage.largeSpaces).toEqual(mockLargeSpacesData);
    });
    
    it('should call handleOccupiedSpaces with spaces', async () => {
      const mockFn = jest.fn()
      garage.handleAddOccupiedSpaces = mockFn;
      await garage.getSpaces();
      expect(mockFn).toHaveBeenCalledWith(mockSpacesData);
    })
  });

  describe('handleRemoveVehicleFromParkingSpaceFetch', () => {

    it('should call ApiCalls.removeVehicleFromParkingSpotInDataBase and return an array with updatedSpots', async () => {
      ApiCalls.removeVehicleFromParkingSpotInDataBase = jest.fn().mockImplementation(() => ([ 
        { id: 341,
          size: 'small',
          row: 5,
          level: 2,
          vehicle_id: 52,
          created_at: '2019-04-01T01:45:02.049Z',
          updated_at: '2019-04-01T01:45:02.049Z' } 
        ]
      ));

      const expected = [{"id": 341, "level": 2, "row": 5, "size": "small", "vehicle_id": 52}];

      const result = await garage.handleRemoveVehicleFromParkingSpaceFetch({mock: 'spot'});
      expect(ApiCalls.removeVehicleFromParkingSpotInDataBase).toHaveBeenCalledWith({mock: 'spot'});
      expect(result).toEqual(expected);
    })
  })

  describe('handleGetVehicles', () => {
    it('should get vehicles and push them into the allParkedVehicles array', async () => {
      await garage.handleGetVehicles();
      expect(garage.allParkedVehicles).toEqual(mockHandleGetVehiclesResult);
    })
  })


  describe('handleAddOccupiedSpots', () => {
    it('should take in and array of spots and sort them into the vehiclesSpots and largeParkedVehiclesSpots objects', async () => {
      await garage.handleGetVehicles();
      garage.handleAddOccupiedSpaces(mockSpacesWithParkedVehicles);
      expect(garage.largeParkedVehiclesSpots).toEqual(mockLargeVehiclesSpots);
      expect(garage.vehiclesSpots).toEqual(mockVehiclesSpots);
    })
  })

  describe('handleRemoveLargeVehicle', () => {
    it('should delete the specified key from largeParkedVehiclesSpots and push the cleared spots into the largeSpaces array', async () => {
      ApiCalls.removeVehicleFromParkingSpotInDataBase = jest.fn().mockImplementation(() => 'success');
      ApiCalls.fetchSpaces = jest.fn().mockImplementation(() => mockSpacesWithParkedVehicles);

      await garage.handleGetVehicles();
      await garage.getSpaces();
      await garage.handleRemoveLargeVehicle(55);
      expect(garage.largeParkedVehiclesSpots).toEqual({});
      expect(garage.largeSpaces).toEqual(mockHandleRemoveLargeVehicleResult);
    })
  })

  describe('removeVehicle', () => {

    it('should remove the specifies vehicle and push small space into array if space is small', async () => {

      ApiCalls.removeVehicleFromParkingSpotInDataBase = jest.fn().mockImplementation(() => 'success');
      ApiCalls.removeVehicleFromDataBase = jest.fn().mockImplementation(() => 'success');
      ApiCalls.fetchSpaces = jest.fn().mockImplementation(() => mockSpacesWithParkedVehicles);
      garage.handleRemoveVehicleFromParkingSpaceFetch = jest.fn().mockImplementation(() => [ { id: 311, row: 1, size: 'small', level: 1, vehicle_id: null } ]);
      await garage.getSpaces();
      await garage.handleGetVehicles();
      await garage.removeVehicle(50);
      expect(garage.smallSpaces).toEqual(mockResultFromRemoveSmallVehicle);
    })

    it('should remove the specifies vehicle and push medium space into array if space is medium', async () => {

      ApiCalls.removeVehicleFromParkingSpotInDataBase = jest.fn().mockImplementation(() => 'success');
      ApiCalls.removeVehicleFromDataBase = jest.fn().mockImplementation(() => 'success');
      ApiCalls.fetchSpaces = jest.fn().mockImplementation(() => mockSpacesWithParkedVehicles);
      garage.handleRemoveVehicleFromParkingSpaceFetch = jest.fn().mockImplementation(() => [ { id: 311, row: 1, size: 'small', level: 1, vehicle_id: null } ])
      await garage.getSpaces();
      await garage.handleGetVehicles();
      await garage.removeVehicle(54);
      expect(garage.mediumSpaces).toEqual(mockResultFromRemoveMediumVehicle);
    });

    it('should remove the specifies vehicle and push large spaces into array if space is large and vehicle is large', async () => {

      ApiCalls.removeVehicleFromParkingSpotInDataBase = jest.fn().mockImplementation(() => 'success');
      ApiCalls.removeVehicleFromDataBase = jest.fn().mockImplementation(() => 'success');
      ApiCalls.fetchSpaces = jest.fn().mockImplementation(() => mockSpacesWithParkedVehicles);
      garage.handleRemoveVehicleFromParkingSpaceFetch = jest.fn().mockImplementation(() => [ { id: 330, row: 3, size: 'large', level: 1, vehicle_id: null } ])
      await garage.getSpaces();
      await garage.handleGetVehicles();
      await garage.removeVehicle(55);
      expect(garage.largeSpaces).toEqual(mockResultFromRemoveLargeVehicle);
    });

    it('should properly remove a medium or small vehicle that is parked in a large space and return that space to the correct row of large spaces', async () => {
      ApiCalls.fetchSpaces = jest.fn().mockImplementation(() => mockSpacesWithSmallVehicleInLargeSpot);
      ApiCalls.fetchVehicles = jest.fn().mockImplementation(() => mockVehiclesWithSmallVehicleInLargeSpot);
      garage.handleRemoveVehicleFromParkingSpaceFetch = jest.fn().mockImplementation(() => [ { id: 330, row: 3, size: 'large', level: 1, vehicle_id: null } ])
      ApiCalls.removeVehicleFromDataBase = jest.fn().mockImplementation(() => 'success');
      ApiCalls.removeVehicleFromParkingSpotInDataBase = jest.fn().mockImplementation(() => 'success');
      await garage.handleGetVehicles();
      await garage.getSpaces();
      await garage.removeVehicle(60);
      expect(garage.largeSpaces).toEqual(mockRemoveSmallVehicleFromLargeSpaceResult);
    });
  });

  describe('addVehicle', () => {

    it('should add a new car with the correct arguments', async () => {
      garage.handleAdd = jest.fn();
      await garage.getSpaces();
      const car = new Car();

      garage.addVehicle(car);
      expect(garage.handleAdd).toHaveBeenCalledWith({"id": 381, "level": 3, "row": 10, "size": "medium", "vehicle_id": null}, car)
    });

    it('should add a new motorcycle with the correct arguments', async () => {
      garage.handleAdd = jest.fn();
      await garage.getSpaces();
      const motorcycle = new MotorCycle();

      await garage.addVehicle(motorcycle);
      expect(garage.handleAdd).toHaveBeenCalledWith({"id": 311, "level": 1, "row": 1, "size": "small", "vehicle_id": null}, motorcycle);
    });

    it('should park a medium car in a large spot if no medium spots are available', async () => {
      ApiCalls.fetchSpaces = jest.fn().mockImplementation(() => mockSpacesWithNoMediumSpots);
      garage.handleAdd = jest.fn();
      await garage.getSpaces();
      await garage.handleGetVehicles();
      garage.addVehicle(new Car());
      expect(garage.handleAdd).toHaveBeenCalledWith({ id: 398, row: 2, size: 'large', level: 3, vehicle_id: null }, {"id": null, "size": "medium"});
    });

    it('should insert a small vehicle into a large spot if there are no small and medium spaces available', async () => {
      ApiCalls.fetchSpaces = jest.fn().mockImplementation(() => onlyLargeSpaces);
      garage.handleAdd = jest.fn();
      await garage.getSpaces();
      await garage.handleGetVehicles();
      garage.addVehicle(new MotorCycle());
      expect(garage.handleAdd).toHaveBeenCalledWith({ id: 398, row: 2, size: 'large', level: 3, vehicle_id: null }, {"id": null, "size": "small"});
    });

    it('should insert a small vehicle into a medium spot if no small spots are available', async () => {
      ApiCalls.fetchSpaces = jest.fn().mockImplementation(() => onlyMediumSpaces);
      garage.handleAdd = jest.fn();
      await garage.getSpaces();
      await garage.handleGetVehicles();
      garage.addVehicle(new MotorCycle());
      expect(garage.handleAdd).toHaveBeenCalledWith({"id": 381, "level": 3, "row": 10, "size": "medium", "vehicle_id": null}, {"id": null, "size": "small"});
    })

    it('should call handleAddLargeVehicle with the correct arguments', async () => {
      garage.handleAddLargeVehicle = jest.fn();
      await garage.getSpaces();
      const bus = new Bus();

      garage.addVehicle(bus);
      expect(garage.handleAddLargeVehicle).toHaveBeenCalledWith(bus);
    });
  });
});