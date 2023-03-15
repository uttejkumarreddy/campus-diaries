"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
}, { timestamps: true });
mongoose.model('College', CollegeSchema);
