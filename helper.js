const service = require('./query/service');

const apiCheck  = (req, res) => {
    res.json({ message: 'hooray! welcome to our api!' });
};
const helloUser  = (req, res) => {
    res.json({ message: 'Hello Awesome User ⭐' });
};

//eslint to setup

module.exports = { apiCheck, helloUser }
