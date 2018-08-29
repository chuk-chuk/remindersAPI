const userDB = require('../query/userDB');

module.exports = (() => {
    /* eslint-disable global-require */
    const router = require('express').Router();

    router.get('/', (req, res, next) => {
        userDB.getAllUsers((err, result) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
            } else {
                if (!result.length) {
                    return next({ statusCode: 404 });
                }
                return res.json(result);
            }
        });
    });

    router.post('/', (req, res, next) => {
        userDB.postUser(req.body.email, req.body.password, (err, object) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
            } else {
                return res.status(200).json([object]);
            }
        });
    });

    router.put('/:userId', (req, res, next) => {
        userDB.updateUser(req.params.userId, req.body.email, req.body.password, (err, object) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
            } else {
                return res.status(200).json([object]);
            }
        });
    });
    
    router.delete('/:userId', (req, res, next) => {
        userDB.deleteUserById(req.params.userId, (err, result) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
            }
            if (result.n < 1) {
                return next();
            }
            return res.status(200).json([result]);
        });
    });

    return router;
})();
