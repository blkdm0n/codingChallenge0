const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const should = chai.should();

chai.use(chaiHttp);

describe("Smart Car API Test Suite", () => {
  it(`should show vehicle data on GET request to "/vehicles/:id"`, done => {
    chai
      .request(app)
      .get("/vehicles/1234")
      .end((err, data) => {
        data.should.have.status(200);
        data.body.should.be.a("object");
        data.body.should.have.property("vin");
        data.body.should.have.property("color");
        data.body.should.have.property("doorCount");
        data.body.should.have.property("driveTrain");
        done();
      });
  });

  it(`should show door status on GET request to "/vehicles/:id/doors"`, done => {
    chai
      .request(app)
      .get("/vehicles/1235/doors")
      .end((err, data) => {
        data.should.have.status(200);
        data.body.should.be.a("array");
        done();
      });
  });

  it(`should show fuel range on GET request to "/vehicles/:id/fuel"`, done => {
    chai
      .request(app)
      .get("/vehicles/1234/fuel")
      .end((err, data) => {
        data.should.have.status(200);
        data.body.should.be.a("object");
        data.body.should.have.property("percent");
        done();
      });
  });

  it(`should show fuel range on GET request to "/vehicles/:id/battery"`, done => {
    chai
      .request(app)
      .get("/vehicles/1235/battery")
      .end((err, data) => {
        data.should.have.status(200);
        data.body.should.be.a("object");
        data.body.should.have.property("percent");
        done();
      });
  });

  it(`should start engine POST req to "/vehicles/:id/engine/:action"`, done => {
    chai
      .request(app)
      .post("/vehicles/1234/engine/start")
      .end((err, data) => {
        data.should.have.status(200);
        data.body.should.be.a("object");
        data.body.should.have.property("status");
        done();
      });
  });
});
