const userDB = require('../query/userDB');

const MIN_PASSWORD_LENGTH = 5;
const MAX_PASSWORD_LENGTH = 10;

module.exports = (() => {
    /* eslint-disable global-require */
    const router = require('express').Router();

    router.get('/', (req, res, next) => {
        userDB.getAllUsers((err, users) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
            } else {
                if (!users.length) {
                    return next({ statusCode: 404 });
                }

                users = users.map((user) => {
                    return { email: user.email, _id: user._id };
                });

                return res.json(users);
            }
        });
    });

    router.post('/', (req, res, next) => {
        if (!req.body) { return res.sendStatus(400); }
        
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Missing email or password');
        }
        
        if (req.body.password.length < MIN_PASSWORD_LENGTH
            || req.body.password.length > MAX_PASSWORD_LENGTH) {
            return res.status(400).send(
                'Password must be between ' + MIN_PASSWORD_LENGTH + ' and '
                    + MAX_PASSWORD_LENGTH + ' characters long'
            );
        }
            
        userDB.getUserByEmail(req.body.email, (err, users) => {
            if (err) return next(err);
        
            if (users.length > 0) {
                return res.status(409).send('A user with the specified email already exists');
            }

            userDB.postUser(req.body.email, req.body.password, (err, user) => {
                if (err) {
                    err.statusCode = 502;
                    return next(err);
                } else {
                    const modifiedUser = { 
                        email: user.email
                    };
                    console.log(modifiedUser);
                    return res.status(200).json([modifiedUser]);
                }
            });
        });  
    });

    router.get('/email/:email', (req, res, next) => {
        const { email } = req.params;
        console.log("REQ>PARAMS", req.params);
        userDB.getUserByEmail(email, (err, user) => {
            if (err) {
                err.statusCode = 503;
                return next(err);
            } else {
                return res.json([user]);
            }
        });
    });

    router.put('/:userId', (req, res, next) => {
        userDB.updateUser(req.params.userId, req.body.email, req.body.password, (err, user) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
            } else {
                return res.status(200).json([user]);
            }
        });
    });
    
    router.delete('/:userId', (req, res, next) => {
        userDB.deleteUserById(req.params.userId, (err, user) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
            }
            if (user.n < 1) {
                return next();
            }
            return res.status(200).json([user]);
        });
    });

    return router;
})();
