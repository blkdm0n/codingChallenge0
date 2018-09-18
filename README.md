# Smart_Car_API

Backend Coding Challenge

Tasks
[X] Implement the Smartcar API specification using any frameworks or libraries as necessary
[X] Provide tests for your API implementation
[X] Write your code to be well structured and documented

Implement the Smartcar API spec by making an HTTP request to the GM API spec

Flow: client --request --> Smartcar API --> GM API

To TEST The Smart Car API

1.  Clone the project from GitHub at https://github.com/blkdm0n/smartCarAPI
2.  cd into the project directory
3.  Install dependencies by typing `yarn` in the projects root directory
4.  Enter `yarn test` to run the test suite

To USE The Smart Car API

1.  Start the server by entering `yarn start` in the command line
2.  Use the following vehicle ids: `1234` and `1235`
3.  Description of ALLOWED HTTP REQUESTS

    RETRIEVE VEHICLE INFO:  
    Request: GET http://localhost:3000/vehicles/:id
    Parameters: Numeric id of the vehicle you'd like to retrieve information on
    Response: {
    "vin": "1234567,
    "color": "black",
    "doorCount": 2,
    "driveTrain": "v6
    }

    RETRIEVE SECURITY INFO:  
    Request: GET http://localhost:3000/vehicles/:id/doors
    Parameters: Numeric id of the vehicle you'd like to retrieve door status on
    Response: [
    {
    "location": frontLeft,
    "locked: true
    },
    {
    "location": frontRight,
    "locked: false
    },
    ]

    RETRIEVE FUEL RANGE:  
    Request: GET http://localhost:3000/vehicles/:id/fuel
    Parameters: Numeric id of the vehicle you'd like to check fuel range of
    Response: {
    "percent": 40
    }

    RETRIEVE BATTERY RANGE:  
    Request: GET http://localhost:3000/vehicles/:id/battery
    Parameters: Numeric id of the vehicle you'd like to check battery range of
    Response: {
    "percent": 80
    }

    START/STOP ENGINE:  
    Request: POST http://localhost:3000/vehicles/:id/engine/:action
    Parameters: 1. Numeric id of the vehicle you'd like to start or stop 2. The action you'd like to perform
    {
    "action": "START|STOP"
    }
    Response: {
    "status": "success|error"
    }
