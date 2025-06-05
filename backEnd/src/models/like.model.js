const mongoose = require('mongoose');
const { Schema } = require('mongoose');


const likeSchema = new Schema({
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    },
    commentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
    },
    likedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
}, {
    timestamps : true
});

const Like = mongoose.model('likes', likeSchema);

module.exports = {
    Like
}
