const { expect } = require('chai');
const chaiHttp = require('chai-http');
const chai = require('chai');
const mongojs = require('mongojs');
const server = require('../server');

const db = mongojs('mongodb://localhost:27017/Reminders');
const collection = db.collection('users-collection');

chai.use(chaiHttp);

const user = {
    email: 'rexx@rexing.com',
    password: '3497307'
};

let token;

describe('Users endpoint', () => {
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

    describe('Get users endpoint', () => {
        it('should return 200', (done) => {
            chai.request(server)
                .get('/users')
                .set('x-user-token', token)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });

        it('should return all saved users', (done) => {
            chai.request(server)
                .get('/users')
                .set('x-user-token', token)
                .end((err, res) => {
                    expect(res.body.length).to.equal(1);
                    done();
                });
        });
    });

    describe('Put endpoint', () => {
        it('should update user details: email', (done) => {
            chai.request(server)
                .get('/users')
                .set('x-user-token', token)
                .end((err, res) => {
                    chai.request(server)
                        .put('/users/' + res.body[0]._id)
                        .set('x-user-token', token)
                        .send({ email: 'updatedEmail@email.com' })
                        .end((err, res) => {
                            console.log("777", res.body)
                            console.log("777", err)
                            if (err) return done(err);
                            else {
                                expect(res.statusCode).to.equal(200);
                                expect(res.body[0].email).to.equal('updatedEmail@email.com');
                                done();
                            }
                        });

                });
        });
        it('should update user details: password', (done) => {
            chai.request(server)
                .get('/users')
                .set('x-user-token', token)
                .end((err, res) => {
                    chai.request(server)
                        .put('/users/' + res.body[0]._id)
                        .set('x-user-token', token)
                        .send({ password: '23644' })
                        .end((err, res) => {
                            if (err) return done(err);
                            else {
                                expect(res.statusCode).to.equal(200);
                                expect(res.body[0].password).to.equal('23644');
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
                .set('x-user-token', token)
                .end((err, res) => {
                    expect(res.body.length).to.equal(1);
                    expect(res.body[0].email).to.equal('updatedEmail@email.com');
                    done();
                });
        });
    });

    describe('Get user by email', () => {
        it('should return a user by given email', (done) => {
            chai.request(server)
                .get('/users')
                .set('x-user-token', token)
                .end((err, res) => {
                    chai.request(server)
                        .get('/users/email/' + res.body[0].email)
                        .set('x-user-token', token);
                    expect(res.body[0].email).to.equal('updatedEmail@email.com');
                    expect(res.body.length).to.equal(1);
                    done();
                });
        });
    });

    describe('Delete endpoint', () => {
        it('should remove user from db', (done) => {
            chai.request(server)
                .get('/users')
                .set('x-user-token', token)
                .end((err, res) => {
                    chai.request(server)
                        .delete('/users/' + res.body[0]._id)
                        .set('x-user-token', token)
                        .end((err, res) => {
                            console.log('user removed');
                            expect(res.statusCode).to.equal(200);
                            done();
                        });
                });
        });
    });

    describe('Post users endpoint', () => {
        it('should post a user', (done) => {
            const user = {
                email: 'fdhgfj@rexing.com',
                password: '3497307'
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
    // you expect a 404 if an authiticated user hits a non-exsistant endpoint
});
