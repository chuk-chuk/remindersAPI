const config = require('config');

const mongojs = require('mongojs');

const { expect } = require('chai');
const chaiHttp = require('chai-http');
const chai = require('chai');

const server = require('../server');

const { host, port, dbName } = config.get('Connection.dbConfig');
const db = mongojs(`mongodb://${host}:${port}/${dbName}`);
const reminderCollection = db.collection('reminders-collection');

chai.use(chaiHttp);

const firstUser = {
    email: 'rexx@rexing.com',
    password: '3497307'
};

const secondUser = {
    email: 'yulia@node.com',
    password: '446281'
};

let tokenForFirstUser;
let tokenForSecondUser;

let reminderId2User;

describe('User journey', () => {
    before(() => {
        db.on('connect', () => {
            console.log('database connected');
        });
    });

    before((done) => {
        chai.request(server)
            .post('/authenticate')
            .send(firstUser)
            .end((err, res) => {
                if (err) return done(err);
                else console.log('second user authenticated');
                /* eslint-disable prefer-destructuring */
                tokenForFirstUser = res.body.token;
                done();
            });
    });

    before((done) => {
        chai.request(server)
            .post('/authenticate')
            .send(secondUser)
            .end((err, res) => {
                if (err) return done(err);
                else console.log('second user authenticated');
                /* eslint-disable prefer-destructuring */
                tokenForSecondUser = res.body.token;
                done();
            });
    });

    after((done) => {
        reminderCollection.remove({}, () => {
            done();
        });
    });

    after((done) => {
        db.close('disconnected', () => {
            console.log('user journey: database disconnected');
            done();
        });
    });

    describe('Second user POST', () => {
        it('should post first reminder', (done) => {
            const reminderOne = {
                text: 'second user first reminder',
                expired_by: '2020-07-17',
                
            };
            chai.request(server)
                .post('/reminders')
                .set('x-user-token', tokenForSecondUser)
                .send(reminderOne)
                .end((err, res) => {
                    if (err) return done(err);
                    else console.log('First Reminder posted');
                    expect(res.statusCode).to.equal(200);
                    reminderId2User = res.body[0]._id;
                    done();
                });    
        });

        it('should post second reminder', (done) => {
            const reminderTwo = {
                text: 'second user second reminder',
                expired_by: '2021-09-19',
            };

            chai.request(server)
                .post('/reminders')
                .set('x-user-token', tokenForSecondUser)
                .send(reminderTwo)
                .end((err, res) => {
                    if (err) return done(err);
                    else console.log('Second Reminder posted');
                    expect(res.statusCode).to.equal(200);
                    done();
                });      
        });
    });

    describe('Second user reminders to display', () => {
        it('should only display reminders of the second user', (done) => {
            chai.request(server)
                .get('/reminders')
                .set('x-user-token', tokenForSecondUser)
                .end((err, res) => {
                    if (err) return done(err);
                    else {
                        expect(res.body.length).to.equal(2);
                        done();
                    }
                });
        });

        it('should display no reminders when the first user logs in', (done) => {
            chai.request(server)
                .get('/reminders')
                .set('x-user-token', tokenForFirstUser)
                .end((err, res) => {
                    if (err) return done(err);
                    else {
                        expect(res.body).to.be.an('object');
                        expect(Object.keys(res.body).length).to.equals(0);
                        done();
                    }
                });
        });
    });

    describe('First user tries to updates reminders of another user', () => {
        it('should only update their own reminders', (done) => {
            chai.request(server)
                .put('/reminders/' + reminderId2User)
                .set('x-user-token', tokenForFirstUser)
                .send({ text: 'MONGO' })
                .end((err, res) => {
                    if (err) return done(err);
                    else {
                        expect(res.statusCode).to.equal(403);
                        done();
                    }
                });
        });
    });

});
