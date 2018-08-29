const { expect } = require('chai');
const chai = require('chai');
const mongojs = require('mongojs');
const chaiHttp = require('chai-http');
const server = require('../server');

const db = mongojs('mongodb://localhost:27017/Reminders');
const collection = db.collection('users-collection');

chai.use(chaiHttp);

describe('Users endpoint', () => {
    before(() => {
        db.on('connect', () => {
            console.log('database connected');
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

    describe('Post users endpoint', () => {
        it('should post a user', (done) => {
            const user = {
                email: 'rex@rexing.com',
                password: '34973509379'
            };

            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    if (err) return done(err);
                    else console.log('user saved');
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });
    
    describe('Get users endpoint', () => {
        it('should return 200', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });

        it('should return all saved users', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    console.log('USERS+++++++++', res.body);
                    expect(res.body.length).to.equal(1);
                    done();
                });
        });
    });
    
    describe('Put endpoint', () => {
        it('should update user details', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    chai.request(server)
                        .put('/users/' + res.body[0]._id)
                        .send({ email: 'updatedEmail@email.com' })
                        .end((err, res) => {
                            if (err) return done(err);
                            else {
                                expect(res.statusCode).to.equal(200);
                                expect(res.body[0].email).to.equal('updatedEmail@email.com');
                                done();
                            }
                        });

                });
        });
    });

    describe('Get users endpoint', () => {
        it('should return all updated users', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    console.log('UPDATED USERS+++++++++', res.body);
                    expect(res.body.length).to.equal(1);
                    expect(res.body[0].email).to.equal('updatedEmail@email.com');
                    done();
                });
        });
    });

    describe('Delete endpoint', () => {
        it('should remove user from db', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    chai.request(server)
                        .delete('/users/' + res.body[0]._id)
                        .end((err, res) => {
                            console.log('user removed');
                            expect(res.statusCode).to.equal(200);
                            done();
                        });
                });
        });
    });
});
