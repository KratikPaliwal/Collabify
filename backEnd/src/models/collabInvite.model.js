const mongoose = require('mongoose');
const { Schema } = require('mongoose');


const inviteSchema = new Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    projectId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Project'
    },
    status : {
        type : String,
        enum : ['pending', 'accepted', 'rejected'],
        default : 'pending'
    }
}, {
    timestamps : true
});

const Invite = mongoose.model('invites', inviteSchema);

module.exports = {
    Invite
}
