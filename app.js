const ParkingGarage = require('./modules/ParkingGarage');
const Bus = require('./modules/Bus');
const MotorCycle = require('./modules/MotorCycle');
const ParkingSpace = require('./modules/ParkingSpace');



const garage = new ParkingGarage();


garage.addVehicle(new MotorCycle(66))