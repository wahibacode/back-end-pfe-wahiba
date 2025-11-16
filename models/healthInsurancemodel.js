const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({
    statut: {
        type: String,
        required: true,
        enum: ["celibataire", "marié"],
    },
    partenaire: {
        nom: {
            type: String,
            validate: {
                validator: function (v) {
                    return this.statut === 'marié' ? !!v : true;
                },
                message: 'Nom is required for a marié statut'
            }
        },
        prenom: {
            type: String,
            validate: {
                validator: function (v) {
                    return this.statut === 'marié' ? !!v : true;
                },
                message: 'Prenom is required for a marié statut'
            }
        },
        cin: {
            type: String,
            validate: {
                validator: function (v) {
                    return this.statut === 'marié' ? !!v : true;
                },
                message: 'CIN is required for a marié statut'
            }
        },
        dateDeNaissance: {
            type: Date,
            validate: {
                validator: function (v) {
                    return this.statut === 'marié' ? !!v : true;
                },
                message: 'Date de naissance is required for a marié statut'
            }
        }
    },
    Documents: [{
        type: String,
        required: true
    }],
    enfants: [{
        nom: {
            type: String
            
        },
        prenom: {
            type: String
        },
    }],
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
        default: 'HealthInsurance',
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

module.exports = mongoose.model('HealthInsurance', healthSchema);
