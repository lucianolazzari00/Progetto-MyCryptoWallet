process.env.MODE = 'testtt'

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should(); 
var index = require('../api')

chai.use(chaiHttp);

describe('Testing /api/price', function() {

    it('should get bitcoin price', function(done) {
        chai
            .request(index)
            .get("/api/price?coin=bitcoin")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.name.should.equal('bitcoin')
                done()
          });
    });
    it('should not get any price (passing fake coin)', function(done) {
        chai
            .request(index)
            .get("/api/price?coin=unknown_coin")
            .end((err, res) => {
                res.should.have.status(400);
                done()
          });
    });
    it('should not get any price (passing unsupported coin)', function(done) {
        chai
            .request(index)
            .get("/api/price?coin=algorand")
            .end((err, res) => {
                res.should.have.status(400);
                done()
          });
    });
});

describe('Testing /api/historical_price', function() {

    it('should get eth price in the last 7 days', function(done) {
        chai
            .request(index)
            .get("/api/historical_price?coin=ethereum")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.price.should.be.a('array');
                res.body.coin.should.equal('ethereum')
                done()
          });
    });
    it('should not get any price (passing fake coin)', function(done) {
        chai
            .request(index)
            .get("/api/price?coin=unknown_coin")
            .end((err, res) => {
                res.should.have.status(400);
                done()
          });
    });
    it('should not get any price (passing unsupported coin)', function(done) {
        chai
            .request(index)
            .get("/api/price?coin=avalanche")
            .end((err, res) => {
                res.should.have.status(400);
                done()
          });
    });
});

describe('Testing /api/stats', function() {

    it('should get generic stats about crypto', function(done) {
        chai
            .request(index)
            .get("/api/stats")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done()
          });
    });
});

describe('Testing /api/gas', function() {

    it('should get gas_price', function(done) {
        chai
            .request(index)
            .get("/api/gas")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done()
          });
    });
});

