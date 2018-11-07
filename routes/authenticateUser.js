const jwt = require('jsonwebtoken');
const userDB = require('../query/userDB');
const config = require('../helpers/config');
const { comparePasswords } = require('../helpers/hash');

module.exports = (() => {
    /* eslint-disable global-require */
    const router = require('express').Router();

    // login an existing user with email and password
    router.post('/', (req, res) => {
        const logValue = Object.assign({}, req.body);
        logValue.password = 'NOT FOR YOU';
        console.log(logValue);

        userDB.getUserByEmail(req.body.email, (err, users) => {
            if (!users.length) {
                return res.status(401).send({ 
                    auth: false, 
                    message: 'User could not be authenticated.' 
                });
            }

            comparePasswords(req.body.password, users[0].password, (err, result) => {
                if (!result) {
                    return res.status(401).send({ 
                        auth: false, 
                        message: 'User could not be authenticated.' 
                    });
                }
                
                const payload = {
                    id: users[0]._id,
                    email: users[0].email
                };
                
                const token = jwt.sign(payload, config.secret, {
                    expiresIn: 86400 // expires in 24 hours 
                });
                
                return res.json({ token });
                
            });
        });

    });

    return router;
})();
