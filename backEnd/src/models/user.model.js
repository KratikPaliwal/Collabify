// require mongoose package : to interact with database
const mongoose = require('mongoose');
// require Schema to create model
const { Schema } = reqiure('mongoose');

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
        index : true
    }, 
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    fullName : {
        type : String,
        required : true,
        trim : true
    },
    avatar : {
        type : String // cloudinary url 
    },
    passward : {
        type : String,
        required : [, "passward is required"]
    },
    refreshToken : {
        type : String
    },
    bio : {
        type : String,
        required : true,
        index : true
    },
    skill : [
        {
            type : String,
            required : true,
            index : true
        }
    ]
}, {
    timestamps : true
});

const User = mongoose.model('users', userSchema);

module.exports = {
    User
}
