const mongoose = require('mongoose');

const insuranceArchiveSchema = mongoose.Schema({
    originalInsuranceId: {
        type: Object,
        default: {}
    },
    insuranceType: {
        type: String,
        required: true,
        enum: ['ProjectInsurance', 'HealthInsurance', 'CarInsurance', 'HouseInsurance', 'RetirementInsurance']
    },
    archivedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('InsuranceArchive', insuranceArchiveSchema);
