const mongoose = require('mongoose');

const sinistreSchema = mongoose.Schema({
    assuranceType: {
        type: String,
        required: true,
        enum: ['ProjectInsurance', 'HealthInsurance', 'CarInsurance', 'HouseInsurance']
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photos: {
        type: [String],
        default: []
    },
    user: {
        type: Object,
        default: {} 
    },
    state: {
        type: String,
        enum: ['Treatement','accepted','refused'],
        default: 'Treatement',
        required: true
    },
    Insurance: {
        type: Object,
        default: {} 
    },

});

module.exports = mongoose.model('Sinistre', sinistreSchema);
