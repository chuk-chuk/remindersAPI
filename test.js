const expect = require('chai').expect;

const chaiHttp = require('chai-http');
const server = require('./server');
const chai = require('chai');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/Reminders'); //connect to DB
var collection = db.collection('reminders-collection');

chai.use(chaiHttp);

describe('API', () => {
    //how to automatically spin up a mongo shell instance during the tests run //docker container nice to have you need mongo running on the standart port
    before(() => {
        db.on('connect', () => {
        console.log('database connected')
        });
    });

    after(() => {
        collection.remove({}, ()=> {
            db.close('disconnected', () => {
            console.log('database disconnected')
            });
        });
    });

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
        it('should post a new reminder', done => {
            let reminder = {
                "text": "testing only",
                "expired_by": "2018-01-24",
                "created_at": "2018-01-22"
            };
            
            chai.request(server)
            .post('/api/reminders')
            .send(reminder)
            .end(function(err,res){
            if(err)
                return done(err);
            else
                console.log('Reminder posted');
                expect(res.statusCode).to.equal(200);
                done();
            })
        });
    });

    describe('GET all /api/reminders', () => {
        it('should get 200 when requesting all reminders', done => {
            chai.request(server)
            .get('/api/reminders')
            .end(function(err, res){
                if (err)
                return done(err);
                else {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    done();
                }
            }); 
        });

        it('should return an array of objects containing some properties', done => {
            chai.request(server)
            .get('/api/reminders')
            .end(function(err, res){
                if (err)
                return done(err);
                else {
                    expect(res.body.length).to.equal(1);
                    expect(res.body[0]).to.have.a.property('text');
                    expect(res.body[0]).to.have.a.property('expired_by');
                    expect(res.body[0]).to.have.a.property('created_at');
                    expect(res.body[0].text).to.equal('testing only');
                    done();
                }
            }); 
        });
    });

    describe('UPDATE', ()=> {
        it('should update the current reminder', done => {
            chai.request(server)
            .get('/api/reminders')
            .end(function(err, res){
                chai.request(server)
                .put('/api/reminders/' + res.body[0]._id)
                .send({'text': 'Spider'})
                .end(function(err, res){
                    if (err)
                    return done(err)
                    else {
                        console.log('edited');
                        expect(res.statusCode).to.equal(200);
                        //expect(res.body[0].text).to.equal('Spider');
                        done();
                    }
                })
            })
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
        it('should get reminders by the given date - /api/reminderByCreateDate/:date', done => {
            chai.request(server)
            .get('/api/reminders')
            .end(function(err, res){
                chai.request(server)
                .get('/api/reminderByCreateDate/' + res.body[0].created_at)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an("array");
                    expect(res.body[0].created_at).to.equal("2018-01-22");
                    done();
                });
            })
        });
    });

    describe('DELETE', () => {
        it('should delete the reminder', done => {
            chai.request(server)
            .get('/api/reminders')
            .end(function(err, res){
                chai.request(server)
                    .delete('/api/reminders/' + res.body[0]._id)
                    .end(function(err, res){
                        console.log('reminder deleted');
                        expect(res.body.message).to.equal('reminder deleted');
                    done();
                });
            });
        });
    });
});

xdescribe('GET no reminders', () => {
    it('should get all the reminders including the updated one', done => {
        chai.request(server)
        .get('/api/reminders')
        .end((err, res) => {
            expect(res.statusCode).to.equal(404);
        done();
        }); 
    });
});

        