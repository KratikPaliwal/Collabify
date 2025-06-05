const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const commentSchema = new Schema({
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    },
    authorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    content : {
        type : String,
        required : true
    }
}, {
    timestamps : true
});

const Comment = mongoose.model('comments', commentSchema);

module.exports = {
    Comment
}
