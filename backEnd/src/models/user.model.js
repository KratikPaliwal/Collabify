// require mongoose package : to interact with database
const mongoose = require('mongoose');
const { required } = require('zod/v4-mini');
// require Schema to create model
const { Schema } = require('mongoose');

const bcrypt = require('bcrypt');

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
    password : {
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
    skills : [
        {
            type : String,
            required : true,
            index : true
        }
    ]
}, {
    timestamps : true
});

userSchema.pre('save', async function (next) {

    // check if user these password or not
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 8);
    next();
})

const User = mongoose.model('users', userSchema);

module.exports = {
    User
}
