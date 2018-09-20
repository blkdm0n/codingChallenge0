// HELPER FUNCTIONS

module.exports = {
  getDoorCount: data => {
    if (data.fourDoorSedan.value === `True`) {
      return 4;
    } else {
      return 2;
    }
  },
  getVehicleInfo: data => {
    let vehicleInfo = {
      vin: data.vin.value,
      color: data.color.value,
      doorCount: module.exports.getDoorCount(data),
      driveTrain: data.driveTrain.value
    };
    return vehicleInfo;
  },
  getDoorStatus: data => {
    let vehicleInfo = [];
    data.doors.values.forEach(door => {
      doorStatus = {
        location: door.location.value,
        locked: door.locked.value
      };
      vehicleInfo.push(doorStatus);
    });
    return vehicleInfo;
  },
  getEngineStatus: data => {
    let currentStatus = {
      status: null
    };
    if (data.actionResult.status === "EXECUTED") {
      currentStatus.status = "success";
    } else {
        currentStatus.status = "error";
    }
    return currentStatus;
  },
  setOptions: (options, route, id) => {
    options.uri += route;
    options.body.id = id;
    return options;
  },
  resetOptionsUri: (options, uri) => {
    options.uri = uri;
  }
};


    
    