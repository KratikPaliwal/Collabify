const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const notificationSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    type : {
        type : String,
        enum : ['invite', 'match', 'comment', 'like', 'system']
    },
    message : {
        type : String,
        required : true
    },
    isRead : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true
});

const Notification = mongoose.model('notifications', notificationSchema);

module.exports = {
    Notification
}