const config = require('config');
const mongojs = require('mongojs');

const { host, port, dbName } = config.get('Connection.dbConfig');
const db = mongojs(`mongodb://${host}:${port}/${dbName}`);
const { ObjectID } = require('mongodb');

console.log({ dbName });
const collection = db.collection('users-collection');

const { hashPassword } = require('../helpers/hash');

module.exports.getAllUsers = (cb) => {
    collection.find().toArray(cb);
};

module.exports.getUserByEmail = (email, cb) => {
    collection.find({ email: email.toLowerCase(), }).toArray(cb);
};

module.exports.postUser = (userEmail, userPassword, cb) => {
    hashPassword(userPassword, (err, hash) => {
        collection.save({
            email: userEmail.toLowerCase(),
            password: hash,
            role: 'USER'
        }, cb);
    });
    
};

module.exports.updateUser = (id, newEmail, newPassword, cb) => {
    const update = {};
    if (typeof newEmail !== 'undefined' && newEmail) {
        update.email = newEmail;
    }
    if (typeof newPassword !== 'undefined' && newPassword) {
        update.password = newPassword;
    }
    
    collection.findAndModify({
        query: { _id: ObjectID(id) },
        update: {
            $set: update
        },
        upsert: false,
        returnOriginal: false,
        new: true
    }, cb);
};

module.exports.deleteUserById = (id, cb) => {
    collection.remove({ _id: ObjectID(id) }, cb);
};
