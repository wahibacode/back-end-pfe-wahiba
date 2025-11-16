const mongoose = require('mongoose');
const validator =require('validator')
const userRoles = require('../utils/userRoles')
const userschema =mongoose.Schema({
    firstname: {
type:String,
required:true
    },
    lastname: {
        type:String,
        required:true
            },
            birthdate: {
                type: Date,
                required: true
            },



            phonenumber: {
                type: String,
                required: true,
                validate: [validator.isMobilePhone, 'field must be a valid phone number']
            },
            
cinnumber:{
    type:String,
    required: true
},




          city: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },



            email: {
                type:String,
                required:true,
                unique:true,
                validate: [validator.isEmail, 'field must be a valid email']
                    },
                    password: {
                        type:String,
                        required:true
                            },
                            token:{
                                type:String
                            },
                            role:{
                                type:String,
                                enum: [userRoles.ADMIN, userRoles.CLIENT],
                                default:userRoles.CLIENT

                            },
                            avatar: {
                                type: String,
                                default: '/uploads/avatar/def.png'
                            },
                            resetPasswordToken: {
                                type: String
                            },
                            resetPasswordExpires: {
                                type: Date
                            },
                            soldeRemboursement: {
                                type: Number

                            }
                            
})


module.exports = mongoose.model('user', userschema)