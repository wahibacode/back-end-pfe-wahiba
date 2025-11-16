const statusHttp = require('../utils/httpstatustext')
const contactmodel = require('../models/contactmodel')

const addContact = async(req,res,next)=>{
const{firstname, lastname, email,phoneNumber,Subject,message} = req.body
const fullName = `${firstname} ${lastname}`;

const firstMessage = {
    message: message,
    sender: fullName,
    date: new Date()
};
req.body.messages = [firstMessage];

let newContact = new contactmodel(req.body);
await newContact.save()
return res.json({status: statusHttp.SUCCESS, data : {contact: newContact}})
}
const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await contactmodel.find();
        return res.json({ status: statusHttp.SUCCESS, data: { contacts } });
    } catch (err) {
        return res.status(500).json({ status: statusHttp.ERROR, message: err.message });
    }
};


module.exports={
    addContact,
    getAllContacts
}