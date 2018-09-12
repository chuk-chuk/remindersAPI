const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../server');

// export default user = {
//     email: 'rex@rexing.com',
//     password: '3497307'
// };
chai.use(chaiHttp);

const headers = {
    auth: { Auth: 'value' }
};
// let token; 

// const returnToken = (done) => {
//     chai.request(server)
//         .post('/users')
//         .send(user)
//         .end((err, res) => {
//             chai.request(server)
//                 .post('/authenticate')
//                 .send(user)
//                 .end((err, res) => {
//                     if (err) return done(err);
//                     else console.log('user saved');
//                     console.log('TOKEN', res.body);
//                     token = res.body.token;
//                     done(err, token);
//                 });
//         });
// };

module.exports = { headers };


