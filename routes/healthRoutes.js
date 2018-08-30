const helper = require('../helpers/helper');

module.exports = (() => {
    /* eslint-disable global-require */
    const router = require('express').Router();

    router.get('/', helper.apiCheck);

    return router;
})();
