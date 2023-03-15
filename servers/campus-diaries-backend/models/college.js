const mongoose = require('mongoose')

const CollegeSchema = new mongoose.Schema({
    name: { type: String, required: true, match: [/^[a-zA-Z\s]*$/, 'is invalid'] },
    abbreviation: { type: String, required: true, match: [/^[A-Z-]*$/, 'is invalid'] },
    address: { type: String, required: true },
    city: { type: String, required: true },
    active: { type: Boolean, required: true },
    // Standard data captured
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

const College = mongoose.model('college', CollegeSchema)

module.exports = College
