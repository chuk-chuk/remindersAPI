const moment = require('moment');
const mongojs = require('mongojs');
const db = mongojs('mongodb://localhost:27017/Reminders');
const ObjectID = require('mongodb').ObjectID;
const collection = db.collection('reminders-collection');

//a new collection to store user names and passwords

module.exports.getAllReminders = (cb) => {
    collection.find().toArray(cb);
}

module.exports.getReminderByDate = (createdDate, cb) => {
    collection.find({ created_at: createdDate }, cb) 
}

module.exports.getReminderByContent = (content, cb) => {
    collection.find({ text: content }, cb)
}

module.exports.postReminder = (content, expiredDate, cb) => {
    collection.save({
        text: content,
        created_at: moment().format("YYYY-MM-DD"),
        expired_by: expiredDate
    }, cb)
}

module.exports.updateReminder = (id, newValueText, newValueExpiry, cb) => {
    const update = {};

    if(typeof newValueText != "undefined" && newValueText) {
        update.text = newValueText
    }
    if(typeof newValueExpiry != "undefined" && newValueExpiry) {
        update.expired_by = newValueExpiry
    }

    collection.findAndModify({
        query: {_id: ObjectID(id)},
        update: { 
            $set: update
        },
        upsert: false,
        returnOriginal: false,
        new: true,
    }, cb)
}

module.exports.deleteReminderById = (id, cb) => {
    collection.remove({_id: ObjectID(id)}, cb)
}