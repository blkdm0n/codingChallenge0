const express = require("express");
const port = 3000;
const request = require("request-promise");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//var vehicleID;

// GET REQUEST FROM CLIENT TO SERVER
app.get(`/`, (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// POST REQUEST FROM CLIENT TO SERVER
app.post(`/vehicle-validation`, (req, res) => {
  function getVehicleID(data) {
    vehicleID = data.body.vehicleID;
  }
  getVehicleID(req);
  if (vehicleID === `1234` || vehicleID === `1235`) {
    res.send(`Your vehicle ID is ${vehicleID}`);
  } else {
    res.send(`Invalid vehicle ID number please try again`);
  }
});

// OPTIONS FOR REQUEST
const gmAPI = "http://gmapi.azurewebsites.net/";
const options = {
  uri: gmAPI,
  method: `POST`,
  body: {
    //this needs to change with user id
    id: "1234",
    responseType: "JSON"
  },
  json: true
};

app.get(`/vehicles/:id`, (req, res) => {
  // HELPER FUNCTION CHECKS DOOR COUNT
  const countDoors = data => {
    if (data.fourDoorSedan.value === `True`) {
      return 4;
    } else {
      return 2;
    }
  };
  options.uri = options.uri + "/getVehicleInfoService";
  // HTTP REQUEST
  request(options)
    .then(data => {
      data = data.data;

      let vehicleInfo = {
        vin: data.vin.value,
        color: data.color.value,
        doorCount: countDoors(data),
        driveTrain: data.driveTrain.value
      };
      // TEST THIS => options.uri = gmAPI;
      res.json(vehicleInfo);
    })
    .catch(err => {
      res.send("Error retrieving Vehicle Info");
    });
});

app.get("/vehicles/:id/doors", (req, res) => {
  options.uri = options.uri + "/getSecurityStatusService";

  request(options)
    .then(data => {
      data = data.data;
      let vehicleInfo = [];
      data.doors.values.forEach(door => {
        let doorStatus = {
          location: door.location.value,
          locked: door.locked.value
        };
        vehicleInfo.push(doorStatus);
      });
      res.json(vehicleInfo);
    })
    .catch(err => {
      res.send("Error retrieving Security Status");
    });
});

app.get(["/vehicles/:id/fuel", "/vehicles/:id/battery"], (req, res) => {
  options.uri = options.uri + "/getEnergyService";

  request(options)
    .then(data => {
      console.log(data, "<=== DATA HERE");
      data = data.data;
      if (req.url === "/vehicles/:id/fuel") {
        let vehicleInfo = {
          percent: data.tankLevel.value
        };
        console.log(options.uri, "Before");
        options.uri = gmAPI;
        console.log(options.uri, "After");
        res.json(vehicleInfo);
      } else {
        if (req.url === "/vehicles/:id/battery") {
          let vehicleInfo = {
            percent: data.batteryLevel.value
          };
          options.uri = gmAPI;
          res.json(vehicleInfo);
        }
      }
    })
    .catch(error => {
      res.send("Error retrieving Energy Levels");
    });
});

app.get("/vehicles/:id/engine", (req, res) => {
  options.uri = gmAPI + "/actionEngineService";
  options.body["command"] = "START_VEHICLE";

  const engineStatus = data => {
    if (data.actionResult.status = "EXECUTED") {
      return "success";
    } else {
      return "error";
    }
  }
  console.log(options.body);

  request(options)
    .then(data => {

      let vehicleInfo = {
        status: engineStatus(data)
      }
      res.json(vehicleInfo);
    })
    .catch(error => {
      res.send("Error retrieving Engine Status");
    });
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
