const mongojs = require('mongojs');

const { ObjectID } = require('mongodb');

const { hashPassword } = require('../helpers/hash');

const db = mongojs('mongodb://localhost:27017/Reminders');

const collection = db.collection('users-collection');

module.exports.getAllUsers = (cb) => {
    collection.find().toArray(cb);
};

module.exports.getUserByEmail = (email, cb) => {
    collection.find({ email: email.toLowerCase(), }).toArray(cb);
    //collection.find({ email: email.toLowerCase() }, { email: 1, password: 1, _id: 1 }).toArray(cb);
};

module.exports.postUser = (userEmail, userPassword, cb) => {
    hashPassword(userPassword, (err, hash) => {
        collection.save({
            email: userEmail.toLowerCase(),
            password: hash // how to exclude this password from outputting with req.body in server.js?
        }, cb);
    });
    
};

module.exports.updateUser = (id, newEmail, newPassword, cb) => {
    const update = {};
    if (typeof newEmail !== 'undefined' && newEmail) {
        update.email = newEmail;
    }
    if (typeof newPassword !== 'undefined' && newPassword) {
        update.password = newPassword; // how to exclude this password from outputting with req.body in server.js?
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
