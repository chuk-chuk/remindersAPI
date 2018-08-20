const helper = require('../helper');

module.exports = (() => {
    'use strict';
    const router = require('express').Router();

    router.get('/', helper.apiCheck);

    return router;
})();