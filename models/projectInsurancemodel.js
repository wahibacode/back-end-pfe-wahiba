const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    nomProjet: {
        type: String,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    secteurActivite: {
        type: String,
        required: true
    },
    statutJuridique: {
        type: String,
        enum: ["individuel", "collabortatif"],
        required: true
    },
    dateCreation: {
        type: Date,
        required: true
    },
    photoLocal: {
        type: [String],
        default: '/uploads/projet/photo/default.png',
        required: true
    },
    Documents: [{
        type: [String],
        required: true
    }],
    actionnaires: [{
        nom: {
            type: String,
        },
        prenom: {
            type: String,
        },
        cin: {
            type: Number,
           
        }
    }],
    // Fields inherited from the common model
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
        default: 'ProjectInsurance',
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
    countingDate:{
        type:Date,
        required:true,
        default: Date.now()

    }
    
});

module.exports = mongoose.model('Project', projectSchema);
