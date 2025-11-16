const mongoose = require('mongoose');

const houseInsuranceSchema = mongoose.Schema({

    address: {
        type: String,
        required: true
    },
    constructionYear: {
        type: Date,
        required: true
    },
    totalArea: {
        type: Number,
        required: true
    },
    numberOfRooms: {
        type: Number,
        required: true
    }, 
    housePictures: {
        type: [String],
        default: '/uploads/house/house.png'  // Default photo URL/path
    },
    user: {
        type: Object,
        default: {}   // Default to an empty object
    },
    state: {
        type: String,
        enum: ['Treatement','Agreement','refused', 'Not paid', 'paid'],
        default: 'Treatement',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    Paiement_rest: {
        type: Number,
        required: true,
        default: 0
    },
    insuranceType: {
        type: String,
        default: 'HouseInsurance',
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

module.exports = mongoose.model('HouseInsurance', houseInsuranceSchema);
