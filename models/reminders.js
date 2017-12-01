var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RemindersSchema = new Schema({
    created_at: Date,
    text: String,
    expired_by: Date
});

module.exports = mongoose.model('Reminders', RemindersSchema);
