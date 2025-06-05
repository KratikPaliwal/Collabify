const mongoose = require('mongoose');

const { Schema } = require('mongoose');

const projectSchema = new Schema({
    title : {
        type : String,
        require : true
    },
    description : {
        type : String,
        require : true
    },
    creator : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    duration : {
        types : Number
    },
    requiredRoles : [
        {
            type : String
        }
    ]
}, {
    timestamps : true
});

const Project = mongoose.model('projects', projectSchema);

module.exports = {
    Project
}

