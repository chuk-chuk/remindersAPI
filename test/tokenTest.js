const { expect } = require('chai');
const chai = require('chai');
const mongojs = require('mongojs');
const chaiHttp = require('chai-http');
const server = require('../server');

const db = mongojs('mongodb://localhost:27017/Reminders');

chai.use(chaiHttp);

const user = {
    email: 'rexx@rexing.com',
    password: '3497307'
};

describe('Token endpoint', () => {
    before(() => {
        db.on('connect', () => {
            console.log('database connected');
        });
    });

    after((done) => {
        db.close('disconnected', () => {
            console.log('database disconnected');
            done();
        });
    });

    describe('Get token endpoint', () => {
        it('should get a token', (done) => {

            chai.request(server)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    if (err) return done(err);
                    else console.log('user authenticated');
                    console.log("TOKEN", res.body.token);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.token).to.be.a('string');

                    done();
                });
        });
    });
});
