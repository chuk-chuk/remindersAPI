const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports.hashPassword = (password, cb) => {
    bcrypt.hash(password, saltRounds, cb);
};

module.exports.comparePasswords = (password, hash, cb) => {
    bcrypt.compare(password, hash, cb);
};
