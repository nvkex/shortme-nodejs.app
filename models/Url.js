const mongoose = require('mongoose');

const URLSchema = new mongoose.Schema({
    slug:{
        type: String,
        required: true,
        trim: true
    },
    url:{
        type: String,
        required: true,
        trim: true
    },
    createdOn:{
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('User', URLSchema);