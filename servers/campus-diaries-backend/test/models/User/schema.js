const expect    = require('chai').expect;
const should    = require('chai').should();
const assert    = require('assert');

const mongoose  = require('mongoose');
const User      = mongoose.model('User');

describe('User Schema Testing', function() {
    it('should not allow duplicate usernames', () => {
        let user = new User();
    });

    it('should not allow duplicate emails', () => {

    });
})