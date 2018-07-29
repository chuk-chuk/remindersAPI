const expect = require('chai').expect;

const chaiHttp = require('chai-http');
const server = require('./server');
const chai = require('chai');
// var mongojs = require('mongojs');
// var db = mongojs('mongodb://localhost:27017/Reminders'); //connect to DB
//var collection = db.collection('reminders-collection');

chai.use(chaiHttp);

describe('Health point /api', () => {
    it('should return 200', done => {
        chai.request(server)
            .get('/api')
            .end((err, res) => {
            expect(res.statusCode).to.equal(200);
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
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('hooray! welcome to our api!');
            done();
        });
    });
});

describe('POST', () => {
    
    it('should post a new reminder to the DB', done => {
        let reminder = {//const vs let in this scope
            "text": "testing only",
            "expired_by": "2018-01-24",
            "created_at": "2018-01-22"
        }
        
        chai.request(server)
        .post('/api/reminder-new')
        .send(reminder)
        .end((err, res) => {
            console.log(res.body[0])
            //TO DO res.body !!!
            expect(res.statusCode).to.equal(200);
            expect(res.body[0]).to.be.a('object');
            expect(res.body[0]).to.have.a.property('text');
            expect(res.body[0]).to.have.a.property('expired_by');
            expect(res.body[0]).to.have.a.property('created_at');
            expect(res.body[0].text).to.equal('testing only');
        done();
        })
    });
});

describe('GET all /api/reminders', () => {
    it('should get all the reminders', done => {
        chai.request(server)
        .get('/api/reminders')
        .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.length).to.equal(1);
        done();
        }); 
    });
});

describe('UPDATE', ()=> {
    it('should update the current reminder', done => {
        console.log('update');
    })
});

describe('GET all /api/reminders', () => {
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
                expect(res.body.length).to.equal(1);
            done();
        });
    });
});

describe('GET by create date', () => {
    // before(() => {
    //     db.on('connect', () => {
    //         console.log('database connected')
    //     });
    //     //how to automatically spin up a mongo shell instance during the tests run //docker container nice to have you need mongo running on the standart port
    //     //clean db after every test run
    // });

    // after(() => {
    //     collection.remove({}, ()=> {
    //         db.close('disconnected', () => {
    //             console.log('database disconnected')
    //         });
    //     });
    // });

    it('should get reminders by the given date - /api/reminderByCreateDate/:date', done => {
        
        let reminder = {
            "text": "testing and only testing",
            "expired_by": "2018-01-20",
            "created_at": "2017-01-22"
        }

        //const cb = (err) => {
            chai.request(server)
            .get('/api/reminderByCreateDate/' + reminder.created_at)
            .send(reminder)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an("array");
                expect(res.body[0].created_at).to.equal("2017-01-22");
            done();
            });
        //};

       // collection.save(reminder, cb);
    });
});

describe('GET by content', ()=> {
    it('should get reminders by its content', done => {
        console.log('get by content')
    });
});

describe('DELETE', () => {
    it('should delete the reminder', done => {
        console.log("delete");
    });
});

describe('GET no reminders', () => {
    it('should get all the reminders including the updated one', done => {
        chai.request(server)
        .get('/api/reminders')
        .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        done();
        }); 
    });
});

        