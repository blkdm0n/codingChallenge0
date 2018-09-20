const express = require("express");
const request = require("request-promise");
const bodyParser = require("body-parser");
const helpers = require("./helpers.js");
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

let route;
let vehicleID;

app.get(`/vehicles/:id`, (req, res) => {
  route = "/getVehicleInfoService";
  vehicleID = req.params.id;
  helpers.setOptions(options, route, vehicleID);
  request(options)
    .then(data => {
      helpers.resetOptionsUri(options, gmAPI);
      data = data.data;
      res.json(helpers.getVehicleInfo(data));
    })
    .catch(err => {
      console.log(err);
      res.send("Error retrieving Vehicle Info");
    });
});

app.get("/vehicles/:id/doors", (req, res) => {
  route = "/getSecurityStatusService";
  vehicleID = req.params.id;
  helpers.setOptions(options, route, vehicleID);
  request(options)
    .then(data => {
      helpers.resetOptionsUri(options, gmAPI);
      data = data.data;
      res.json(helpers.getDoorStatus(data));
    })
    .catch(err => {
      console.log(err);
      res.send("Error retrieving Security Status");
    });
});

app.get(["/vehicles/:id/fuel", "/vehicles/:id/battery"], (req, res) => {
  route = "/getEnergyService";
  vehicleID = req.params.id;
  helpers.setOptions(options, route, vehicleID);
  request(options)
    .then(data => {
      helpers.resetOptionsUri(options, gmAPI);
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
  route = "/actionEngineService";
  vehicleID = req.params.id;
  helpers.setOptions(options, route, vehicleID);
  if (req.params.action.toUpperCase() === "START") {
    options.body.command = "START_VEHICLE";
  } else {
    options.body.command = "STOP_VEHICLE";
  }
  request(options)
    .then(data => {
      helpers.resetOptionsUri(options, gmAPI);
      res.json(helpers.getEngineStatus(data));
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
