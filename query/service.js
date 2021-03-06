const config = require('config');
const mongojs = require('mongojs');

const moment = require('moment');

const { host, port, dbName } = config.get('Connection.dbConfig');
const db = mongojs(`mongodb://${host}:${port}/${dbName}`);
const { ObjectID } = require('mongodb');

console.log({ dbName });
const collection = db.collection('reminders-collection');

module.exports.getRemindersForUser = (id, cb) => {
    collection.find({ userId: id }, cb); 
};

module.exports.getReminderById = (reminderId, cb) => {
    collection.find({ _id: ObjectID(reminderId) }, cb);
};

module.exports.getReminderByDate = (tokenUserId, createdDate, cb) => {
    collection.find({ userId: tokenUserId, created_at: createdDate }, cb); 
};

module.exports.getReminderByContent = (tokenUserId, content, cb) => {
    collection.find({ userId: tokenUserId, text: content }, cb);
};

module.exports.postReminder = (content, expiredDate, tokenUserId, cb) => {
    collection.save({
        text: content,
        created_at: moment().format('YYYY-MM-DD'),
        expired_by: expiredDate,
        userId: tokenUserId
    }, cb);
};

module.exports.updateReminder = (reminderId, newValueText, newValueExpiry, tokenUserId, cb) => {
    const update = {};
    console.log('in update reminder');

    if (typeof newValueText !== 'undefined' && newValueText) {
        update.text = newValueText;
    }
    if (typeof newValueExpiry !== 'undefined' && newValueExpiry) {
        update.expired_by = newValueExpiry;
    }

    // handle _id: ObjectID(reminder), userId: tokenUserId if does not exist
    if (reminderId) {
        collection.findAndModify({
            query: { _id: ObjectID(reminderId), userId: tokenUserId },
            update: { 
                $set: update
            },
            upsert: false,
            returnOriginal: false,
            new: true,
        }, cb);
    }
};

module.exports.deleteReminderById = (reminder, tokenUserId, cb) => {
    collection.remove({ userId: tokenUserId, _id: ObjectID(reminder) }, cb);
};
