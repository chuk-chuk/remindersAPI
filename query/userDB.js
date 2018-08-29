const mongojs = require('mongojs');

const db = mongojs('mongodb://localhost:27017/Reminders');
const { ObjectID } = require('mongodb');

const collection = db.collection('users-collection');

module.exports.getAllUsers = (cb) => {
    collection.find().toArray(cb);
};

module.exports.postUser = (userEmail, userPassword, cb) => {
    collection.save({
        email: userEmail,
        password: userPassword
    }, cb);
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
