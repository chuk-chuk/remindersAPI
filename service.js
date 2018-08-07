
const mongojs = require('mongojs');
const db = mongojs('mongodb://localhost:27017/Reminders'); //connect to DB
const ObjectID = require('mongodb').ObjectID;
const collection = db.collection('reminders-collection');

module.exports.getAllReminders = (cb) => {
    collection.find().toArray(cb);
}

module.exports.getReminderByDate = (createdDate, cb) => {
    collection.find({ created_at: createdDate }, cb)
}

module.exports.getReminderByContent = (content, cb) => {
    collection.find({ text: content }, cb)
}
module.exports.deleteReminderById = (id, cb) => {
    collection.remove({_id: ObjectID(id)}, cb)
}

module.exports.updateReminder = (id, newValue, cb) => {
    collection.findAndModify({
        query: {_id: ObjectID(id)},
        update: { 
          $set: {text: newValue}
        },
        upsert: false,
        returnOriginal: false,
        new: true,
      }, cb)
}