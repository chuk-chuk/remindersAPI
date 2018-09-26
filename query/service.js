const moment = require('moment');
const mongojs = require('mongojs');

const db = mongojs('mongodb://localhost:27017/Reminders');
const { ObjectID } = require('mongodb');

const collection = db.collection('reminders-collection');

// a new collection to store user names and passwords

module.exports.getRemindersForUser = (id, cb) => {
    collection.find({ userId: id }, cb); 
};

module.exports.getReminderByDate = (tokenUserId, createdDate, cb) => {
    collection.find({ userId: tokenUserId, created_at: createdDate }, cb); 
    // collection.find({ created_at: createdDate }, cb); 
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

module.exports.updateReminder = (tokenUserId, reminder, newValueText, newValueExpiry, cb) => {
    const update = {};
    if (tokenUserId) {

        if (typeof newValueText !== 'undefined' && newValueText) {
            update.text = newValueText;
        }
        if (typeof newValueExpiry !== 'undefined' && newValueExpiry) {
            update.expired_by = newValueExpiry;
        }
        return update;
    }

    collection.findAndModify({
        query: { _id: ObjectID(reminder) },
        update: { 
            $set: update
        },
        upsert: false,
        returnOriginal: false,
        new: true,
    }, cb);
};

module.exports.deleteReminderById = (tokenUserId, reminder, cb) => {
    collection.remove({ userId: tokenUserId, _id: ObjectID(reminder) }, cb);
};
