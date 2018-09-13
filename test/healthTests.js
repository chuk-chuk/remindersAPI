const { expect } = require('chai');
const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server');

chai.use(chaiHttp);

describe('API health endpoints ', () => {
    
    describe('Health endpoint', () => {
        it('should return 200', (done) => {
            chai.request(server)
                .get('/health')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
        
        it('should return 403 when no endpoint exists', (done) => {
            chai.request(server)
                .get('/aaappii')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(403);
                    done();
                });
        });
        
        it('should get the welcome message', (done) => {
            chai.request(server)
                .get('/health')
                .end((err, res) => {
                    expect(res.body.message).to.be.a('string');
                    expect(res.body.message).to.equal('hooray! welcome to our api!');
                    done();
                });
        });
    });
});

        
