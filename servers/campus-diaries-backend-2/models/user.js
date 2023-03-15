const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

var UserSchema = new mongoose.Schema({
    full_name: { type: String, required: true, match: [/^[a-zA-Z\s]+$/, 'is invalid'] },
    user_name: { type: String, required: true, match: [/^[a-zA-Z0-9._-]+$/] },
    roll_number: { type: String, required: true },
    college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    password_hash: { type: String, required: true },
    college_id_proof: [{ type: String }],
    roles: [{ type: String, required: true, default: '', match: [/^[a-zA-Z_]+$/, 'is invalid'] }],
    // Standard data captured
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updated_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }]
}, { timestamps: true })

const User = mongoose.model('user', UserSchema)

module.exports = User
