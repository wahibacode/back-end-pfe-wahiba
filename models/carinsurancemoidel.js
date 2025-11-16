const mongoose = require('mongoose');
const validator = require('validator');

const carSchema = mongoose.Schema({
    marque: {
        type: String,
        required: true
    },
    model: {
        type: String,  // Assuming model name is a string
        required: true
    },
    numeroImmatriculation: {
        type: String,
        required: true
    },
    numeroChassis: {
        type: String,
        required: true
    },
    valeurEstime: {
        type: Number,
        required: true
    },
    useCase: {
        type: String,
        enum: ["personnel","professionel"],
        required: true
    },
    photo: {
        type: [String],  // Assuming you'll store the URL/path to the photo
        default: '/uploads/car/car.png'
    },
    user: {
        type: Object,
        default: {}   // Replace 'User' with the actual name of your User model
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
        default: 'CarInsurance',
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

module.exports = mongoose.model('Car', carSchema);
