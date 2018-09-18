const express = require("express");
const PORT = 3000;
const request = require("request-promise");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var vehicleID;

// GET REQUEST FROM CLIENT TO SERVER
app.get(`/`, (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// OPTIONS FOR REQUEST
const gmAPI = "http://gmapi.azurewebsites.net";
const options = {
  uri: gmAPI,
  method: `POST`,
  body: {
    id: null,
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
  options.body.id = req.params.id;
  request(options)
    .then(data => {
      options.uri = gmAPI;
      data = data.data;
      let vehicleInfo = {
        vin: data.vin.value,
        color: data.color.value,
        doorCount: countDoors(data),
        driveTrain: data.driveTrain.value
      };
      res.json(vehicleInfo);
    })
    .catch(err => {
      console.log(err);
      res.send("Error retrieving Vehicle Info");
    });
});

app.get("/vehicles/:id/doors", (req, res) => {
  options.uri = options.uri + "/getSecurityStatusService";
  options.body.id = req.params.id;
  request(options)
    .then(data => {
      options.uri = gmAPI;
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
      console.log(err);
      res.send("Error retrieving Security Status");
    });
});

app.get(["/vehicles/:id/fuel", "/vehicles/:id/battery"], (req, res) => {
  options.uri = options.uri + "/getEnergyService";
  options.body.id = req.params.id;

  request(options)
    .then(data => {
      options.uri = gmAPI;
      data = data.data;
      if (req.url === `/vehicles/${options.body.id}/fuel`) {
        let vehicleInfo = {
          percent: data.tankLevel.value
        };
        res.json(vehicleInfo);
      } else {
        if (req.url === `/vehicles/${options.body.id}/battery`) {
          let vehicleInfo = {
            percent: data.batteryLevel.value
          };
          res.json(vehicleInfo);
        }
      }
    })
    .catch(err => {
      console.log(err);
      res.send("Error retrieving Energy Levels");
    });
});

app.post("/vehicles/:id/engine/:action", (req, res) => {
  options.uri = gmAPI + "/actionEngineService";
  options.body.id = req.params.id;

  if (req.params.action.toUpperCase() === "START") {
    options.body.command = "START_VEHICLE";
  } else {
    options.body.command = "STOP_VEHICLE";
  }
  const engineStatus = data => {
    if (data.actionResult.status === "EXECUTED") {
      return "success";
    }
    return "error";
  };
  request(options)
    .then(data => {
      options.uri = gmAPI;
      const vehicleInfo = {
        status: engineStatus(data)
      };
      res.json(vehicleInfo);
    })
    .catch(err => {
      console.log(err);
      res.send("Error retrieving Engine Status");
    });
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

module.exports = app;
