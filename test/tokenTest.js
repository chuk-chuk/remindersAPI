const config = require('config');

const mongojs = require('mongojs');

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

const server = require('../server');

const { host, port, dbName } = config.get('Connection.dbConfig');
const db = mongojs(`mongodb://${host}:${port}/${dbName}`);

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
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.token).to.be.a('string');
                    done();
                });
        });
    });
});
