const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const postSchema = new Schema({
    authorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    projectId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Project'
    },
    content : {
        type : String,
        required : true
    }
}, {
    timestamps : true
});

const Post = mongoose.model('posts', postSchema);

module.exports = {
    Post
}
