const expect = require('chai').expect;

const chaiHttp = require('chai-http');
const server = require('./server');
const chai = require('chai');
const mongoose = require("mongoose");

chai.use(chaiHttp);

describe('/api', () => {
    it('should return 200', done => {
        chai.request(server)
            .get('/api')
            .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body.message).to.be.a('string');
            done();
        });
    });

    it('should return 404', done => {
        chai.request(server)
            .get('/aaappii')
            .end((err, res) => {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });

    it('should get the welcome message', done => {
        chai.request(server)
        .get('/api')
        .end((err, res) => {
            expect(res.body.message).to.equal('hooray! welcome to our api!');
            done();
        });
    });
})

describe('/api/reminders', () => {
    before(() => {
        mongoose.createConnection('mongodb://localhost:27017/Reminders');
        //how to automatically spin up a mongo shell instance during the tests run
    });

    after(() => {
        mongoose.connection.close();
    });

    it('should return 200', done => {
        chai.request(server)
            .get('/api/reminders')
            .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('should return 404', done => {
        chai.request(server)
            .get('/api/remindersssss')
            .end((err, res) => {
            expect(res.statusCode).to.equal(404);
            done();
        });
    });

    it('should return an array of objects', done => {
        chai.request(server)
            .get('/api/reminders')
            .end((err, res) => {
                expect(res.body).to.be.an('array');
            done();
        });
    });
});

describe('/api/reminder-new', () => {
    before(() => {
        mongoose.createConnection('mongodb://localhost:27017/Reminders');
        //how to automatically spin up a mongo shell instance during the tests run
    });

    after(() => {
        mongoose.connection.close();
    });

    it('should post a new reminder to the DB', done => {
        let reminder = {
            "text": "testing only",
            "expired_by": "2018-01-24",
            "created_at": "2018-01-22"
        }
        
        chai.request(server)
        .post('/api/reminder-new')
        .send(reminder)
        .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(reminder).to.be.a('object');
            expect(reminder).to.have.a.property('text');
            expect(reminder).to.have.a.property('expired_by');
            expect(reminder).to.have.a.property('created_at');
            expect(reminder.text).to.equal('testing only');
        done();
        })
    });
});

describe.only('/api/reminderByCreateDate/:date', () => {
    before(() => {
        mongoose.createConnection('mongodb://localhost:27017/Reminders');
        //how to automatically spin up a mongo shell instance during the tests run
    });

    after(() => {
        mongoose.connection.close();
    });

    it('should get reminders by the given date', done => {
        let reminder = {
            "text": "testing and only testing",
            "expired_by": "2018-01-20",
            "created_at": "2017-01-22"
        }

        reminder.save((err, reminder) => {
            chai.request(server)
            .get('/api/reminderByCreateDate/' + reminder.created_at)
            .send(reminder)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
            done();
            });
        });
    });
});
        