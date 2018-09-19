const jwt = require('jsonwebtoken');
const userDB = require('../query/userDB');
const config = require('../helpers/config');
const { comparePasswords } = require('../helpers/hash');


module.exports = (() => {
    /* eslint-disable global-require */
    const router = require('express').Router();

    router.post('/', (req, res, next) => {
        console.log(req.body); // how to exclude password from outputting with req.body in server.js?
        
        // Check user against db
        userDB.getUserByEmail(req.body.email, (err, users) => {
            console.log("ERROR", err);
            console.log("getUserByEmail", users);
            if (!users.length) {
                return next();
            }

            if (users[0].email !== req.body.email) {
                const err = new Error('Nope go away');
                return next(err);
            }

            comparePasswords(req.body.password, users[0].password, (err, result) => {
                // console.log({ err });
                // console.log({ result });
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

                const userId = jwt.decode(token).id;
                console.log('DecodedUserId', userId); //5ba22897a8aa3b9a2fee1f7f
                
                return res.json({ token });
                
            });
        });

    });

    return router;
})();
