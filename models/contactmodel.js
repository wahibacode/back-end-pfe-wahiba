const { text } = require('express');
const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, 'Invalid email']
    },
    phoneNumber: {
        type: String,
        required: true
       
    },
    Subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    messages: [{
        message: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        sender: {
            type: String,
            required: true
        }
    }],
    state: {
        type: String,
        enum: ['Treatement','Solved'],
        default: 'Treatement',
    }

});

module.exports = mongoose.model('Contact', contactSchema);
