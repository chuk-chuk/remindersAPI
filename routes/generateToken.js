const jwt = require('jsonwebtoken');
const userDB = require('../query/userDB');
const config = require('../helpers/config');
const { comparePasswords } = require('../helpers/hash');


module.exports = (() => {
    /* eslint-disable global-require */
    const router = require('express').Router();

    router.post('/', (req, res, next) => {
        console.log(req.body);
        
        // Check user against db
        userDB.getUserByEmail(req.body.email, (err, users) => {
            console.log(err);
            console.log(users);
            if (!users.length) {
                return next();
            }

            if (users[0].email !== req.body.email) {
                const err = new Error('Nope go away');
                return next(err);
            }

            comparePasswords(req.body.password, users[0].password, (err, result) => {
                console.log({ err });
                console.log({ result });
                if (!result) {
                    const err = new Error('Nope go away');
                    return next(err);
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
