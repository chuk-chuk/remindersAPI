var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReminderSchema = new Schema({
    created_at: Date,
    text: String,
    expired_by: Date
});

module.exports = mongoose.model('Reminder', ReminderSchema);
