const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

const user = {
    email: 'rexx@rexing.com',
    password: '3497307'
};

before((done) => {
    chai.request(server)
        .post('/users')
        .send(user)
        .end((err, res) => {
            console.log('@@@@@@@@ err', err);
            console.log('@@@@@@@@ res.body', res.body);
            if (err) return done(err);
            else console.log('user saved');
            console.log('&&&&&', res.body);
            console.log(res.error);                
            // else token = res.body.token;
            done();
        });
});

