export {};
const mongoose = require('mongoose');

let CollegeSchema = new mongoose.Schema({
    createdBy: {
        type: String,
        required: true
    },
    updatedBy: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    active: {
        type: Boolean
    }
}, {timestamps: true});

mongoose.model('College', CollegeSchema);