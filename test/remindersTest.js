const { expect } = require('chai');
const chaiHttp = require('chai-http');
const chai = require('chai');
const moment = require('moment');
const mongojs = require('mongojs');
// const jwt = require('jsonwebtoken');

const server = require('../server');

const db = mongojs('mongodb://localhost:27017/Reminders');
const collection = db.collection('reminders-collection');

chai.use(chaiHttp);

const user = {
    email: 'rexx@rexing.com',
    password: '3497307'
};

let token;

describe.only('Reminders API', () => {
    before(() => {
        db.on('connect', () => {
            console.log('database connected');
        });
    });
    before((done) => {

        chai.request(server)
            .post('/authenticate')
            .send(user)
            .end((err, res) => {
                if (err) return done(err);
                else console.log('user authenticated');
                console.log('TOKEN', res.body);
                /* eslint-disable prefer-destructuring */
                token = res.body.token;
                done();
            });
    });

    after((done) => {
        collection.remove({}, () => {
            db.close('disconnected', () => {
                console.log('database disconnected');
                done();
            });
        });
    });

    describe('POST', () => {
        it('should post a new reminder', (done) => {
            const reminder = {
                text: 'testing only',
                expired_by: '2018-01-24',
                
            };
            chai.request(server)
                .post('/reminders')
                .set('x-user-token', token)
                .send(reminder)
                .end((err, res) => {
                    if (err) return done(err);
                    else console.log('Reminder posted');
                    expect(res.statusCode).to.equal(200);
                    done();
                });      
        });
    });

    describe('GET all /api/reminders', () => {
        it('should get 200 when requesting all reminders', (done) => {
            chai.request(server)
                .get('/reminders')
                .set('x-user-token', token)
                .end((err, res) => {
                    if (err) return done(err);
                    else {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body).to.be.an('array');
                        done();
                    }
                }); 
        });

        it('should return an array of objects containing some properties', (done) => {
            chai.request(server)
                .get('/reminders')
                .set('x-user-token', token)
                .end((err, res) => {
                    if (err) return done(err);
                    else {
                        expect(res.body[0]).to.have.a.property('text');
                        expect(res.body[0]).to.have.a.property('expired_by');
                        expect(res.body[0]).to.have.a.property('created_at');
                        expect(res.body.length).to.equal(1);
                        expect(res.body[0].text).to.equal('testing only');
                        done();
                    }
                }); 
        });
    });

    describe('GET all reminders that belong to a user', () => {
        it('should return a list of reminders for a given user', (done) => {
            chai.request(server)
                .get('/reminders')
                .set('x-user-token', token)
                .end((err, req, res) => {
                    console.log('RES>>>>BODY', res);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
            done();
        });
        // });
    });

    describe('UPDATE', () => {
        it('should update the current reminder', (done) => {
            chai.request(server)
                .get('/reminders')
                .set('x-user-token', token)
                .end((err, res) => {
                    console.log("777", res.body)
                    chai.request(server)
                        .put('/reminders/' + res.body[0]._id)
                        .set('x-user-token', token)
                        .send({ text: 'MONGO' })
                        .end((err, res) => {
                            console.log("666", err)
                            // console.log({err, res});
                            if (err) return done(err);
                            else {
                                expect(res.statusCode).to.equal(200);
                                expect(res.body[0].text).to.equal('MONGO');
                                done();
                            }
                        });
                });
        });
    });

    describe('GET all /api/reminders', () => {
        it('should return 200', (done) => {
            chai.request(server)
                .get('/reminders')
                .set('x-user-token', token)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });

        it('should return 404', (done) => {
            chai.request(server)
                .get('/remindersssss')
                .set('x-user-token', token)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(404);
                    done();
                });
        });

        it('should return an array of objects', (done) => {
            chai.request(server)
                .get('/reminders')
                .set('x-user-token', token)
                .end((err, res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(1);
                    done();
                });
        });
    });

    describe('GET by create date', () => {
        it('should get reminders by the given date', (done) => {
            chai.request(server)
                .get('/reminders')
                .set('x-user-token', token)
                .end((err, res) => {
                    chai.request(server)
                        .get('/reminders/date/' + res.body[0].created_at)
                        .set('x-user-token', token)
                        .end((err, res) => {
                            expect(res.statusCode).to.equal(200);
                            expect(res.body).to.be.an('array');
                            expect(res.body[0][0].created_at).to.equal(moment().format('YYYY-MM-DD'));
                            done();
                        });
                });
        });
    });

    describe('GET by content', () => {
        it('should get reminders by the searching content', (done) => {
            chai.request(server)
                .get('/reminders')
                .set('x-user-token', token)
                .end((err, res) => {
                    chai.request(server)
                        .get('/reminders/content/' + res.body[0].text)
                        .set('x-user-token', token)
                        .end((err, res) => {
                            expect(res.statusCode).to.equal(200);
                            // expect(res.body[0][0].text).to.equal('MONGO');
                            done();
                        });
                });
        });
    });

    describe('DELETE', () => {
        it('should delete the reminder', (done) => {
            chai.request(server)
                .get('/reminders')
                .set('x-user-token', token)
                .end((err, res) => {
                    chai.request(server)
                        .delete('/reminders/' + res.body[0]._id)
                        .set('x-user-token', token)
                        .end((err, res) => {
                            console.log('reminder deleted');
                            expect(res.statusCode).to.equal(404);
                            done();
                        });
                });
        });
    });

    xdescribe('GET no reminders', () => {
        it('should NOT get any reminders and send 404', (done) => {
            chai.request(server)
                .get('/reminders')
                .set('x-user-token', token)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(404);
                    done();
                }); 
        });
    });
    // you expect a 404 if an authiticated user hits a non-exsistant endpoint
});

        
