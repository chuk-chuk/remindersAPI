const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

const firstUser = {
    email: 'rexx@rexing.com',
    password: '3497307'
};

const secondUser = {
    email: 'yulia@node.com',
    password: '446281'
};

before((done) => {
    chai.request(server)
        .post('/users')
        .send(firstUser)
        .end((err, res) => {
            if (err) return done(err);
            else console.log('first user saved');
            done();
        });
});

before((done) => {
    chai.request(server)
        .post('/users')
        .send(secondUser)
        .end((err, res) => {
            if (err) return done(err);
            else console.log('second user saved');
            done();
        });
});

