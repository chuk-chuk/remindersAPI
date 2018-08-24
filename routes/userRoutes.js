
const helper = require('../helper');

module.exports = (() => {
    /* eslint-disable global-require */
    const router = require('express').Router();

    router.get('/', helper.helloUser);

    return router;
})();
