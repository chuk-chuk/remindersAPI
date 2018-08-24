const { expect } = require('chai');
const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server');

chai.use(chaiHttp);

describe('User endpoint', () => {
    
    describe('User endpoint call', () => {
        it('should return 200', (done) => {
            chai.request(server)
                .get('/user')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });      
});
