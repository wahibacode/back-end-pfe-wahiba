const mongoose = require('mongoose');

const retraiteSchema = new mongoose.Schema({
    extraitDeNaissance: {
        type: String,
        required: true
    },
    preuveDActivite: {
        type: String,
        required: true
    },
    cin: {
        type: String,
        required: true
    },
    revenuesMensuel: {
        type: Number,
        required: true
    },
    sommeADeposer: {
        type: Number,
        required: true
    },
    user: {
        type: Object,
        default: {} // Default to an empty object
    },
    state: {
        type: String,
        enum: ['Treatement','Agreement','refused', 'Not paid', 'paid'],
        default: 'Treatement',
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    Paiement_rest: {
        type: Number,
        required: true,
        default: 0
    },
    insuranceType: {
        type: String,
        default: 'RetirementInsurance', // Changed the insurance type to "RetirementInsurance"
        required: true
    },
    contrat: {
        type: String
      
    },
    firststepPaiement: {
        type: Number,
        default:0
    },
    modeDePaiement: {
        type: String,
        enum: ['trimestre','semestriel'],
        default: 'trimestre',
    },
    countingDate: {
        type:Date,
        required:true,
        default: Date.now()
    }
});

module.exports = mongoose.model('RetirementInsurance', retraiteSchema);
