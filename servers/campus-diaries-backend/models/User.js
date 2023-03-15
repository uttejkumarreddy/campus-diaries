const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const getJwt = require('../utils/security/jwt-operations').getAuthenticatedUserToken;

const saltRounds = 10;

/* --------- UserSchema ---------- */
const UserSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'cannot be empty'],
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'cannot be empty']
    },
    name: {
        type: String,
        required: [true, 'cannot be empty'],
        match: [/^[a-zA-Z]{3,}$/, 'is invalid']
    },
    username: {
        type: String,
        required: [true, 'cannot be empty'],
        match: [/^[a-zA-Z0-9_.]{3,}$/, 'is invalid'],
        maxlength: 16,
        unique: true,
        index: true,
        validate: {
            validator: async (un) => {
                let results = await mongoose.models['User'].findOne({
                    username: un
                });
                if (results) {
                    return false;
                }
                return true;
            },
            message: props => `${props.value} is already taken`
        }
    },
    rollnumber: {
        type: Number,
        unique: true,
        index: true,
        validate: {
            validator: async (rn) => {
                let results = await mongoose.models['User'].findOne({
                    rollnumber: rn
                });
                if (results) {
                    return false;
                }
                return true;
            },
            message: props => `${props.value} is already taken`
        }
    },
    email: {
        type: String,
        required: [true, 'cannot be empty'],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        lowercase: true,
        unique: true,
        index: true,
        validate: {
            validator: async (e) => {
                let results = await mongoose.models['User'].findOne({
                    email: e
                });
                if (results) {
                    return false;
                }
                return true;
            },
            message: props => `${props.value} is already taken`
        }
    },
    status: {
        type: String,
        maxlength: 100,
        default: null
    },
    image: {
        type: String,
        default: null
    },
    password: {
        type: String
    },
    activated: {
        type: Boolean,
        default: false
    },
    activationKey: {
        type: String,
        maxlength: 72,
        default: null
    },
    passwordResetKey: {
        type: String,
        maxlength: 72,
        default: null
    }

}, {
    timestamps: true
});

/* ---------- UserSchema methods ---------- */
UserSchema.methods.setPassword = (pwd, done) => {
    bcrypt.hash(pwd, saltRounds)
        .then(hash => done(null, hash))
        .catch(err => done(err, null))
}

UserSchema.methods.validatePassword = (pwd, hash, done) => {
    bcrypt.compare(pwd, hash)
        .then(res => done(null, res))
        .catch(err => done(err, null))
}

mongoose.model('User', UserSchema);