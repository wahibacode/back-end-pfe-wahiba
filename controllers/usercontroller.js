const statusHttp = require('../utils/httpstatustext')
const sendAdminNotification = require('../utils/sendAdminNotification');

const appError = require('../utils/appError')
const {validationResult} = require('express-validator')
const usermodel = require('../models/usermodel');
const InsuranceArchive = require('../models/archiveInsurance');
const sendRefusalEmail = require('../utils/sendRefusalEmail');
const { request } = require('express');
const { findOne } = require('../models/coursemodel');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT');
var cookieParser = require('cookie-parser')
const crypto = require('crypto');
const sendResetEmail = require('../utils/sendResetEmail');
const { log } = require('console');
const { use } = require('../routes/userroute');
const healthInsurancemodel = require('../models/healthInsurancemodel');
const projectInsurancemodel = require('../models/projectInsurancemodel');
const houseInsurancemodel = require('../models/houseInsurancemodel');
const carinsurancemoidel = require('../models/carinsurancemoidel');
const retraiteInsurancemodel = require('../models/retraiteInsurancemodel');
const Contact = require("../models/contactmodel")
const HealthInsuranceModel = require('../models/healthInsurancemodel');
const ProjectInsuranceModel = require('../models/projectInsurancemodel');
const CarInsuranceModel = require('../models/carinsurancemoidel');
const Sinistre = require('../models/sinistremodel')
const generateContract = require('../utils/generateContract');
const sendContractEmail = require('../utils/sendContractEmail');
const sendInsuranceNotification = require('../utils/sendInsuranceNotification');
const HouseInsuranceModel = require('../models/houseInsurancemodel');
const sendReimbursementEmail = require('../utils/mail'); // Import the mailing utility
const sendNotificationEmail = require('../utils/sendNotificationEmail')
const getallusers =async (req,res)=>{
    const query = req.query;
        let limit = query.limit || 10;
        let page = query.page || 1;
        const skip = (page - 1 ) * limit;
        
             const users = await usermodel.find({},{"__v": false}).limit(limit).skip(skip)
             res.json({status: statusHttp.SUCCESS, data: users})
        }

const register = async(req,res,next)=>{
    console.log(req.body);
const{firstname, lastname,birthdate, phonenumber, cinnumber, address, city, email, password, role } = req.body
const oldUser = await usermodel.findOne({email: email})
if(oldUser)
{
    const error1 = appError.create('user already exists', 400, statusHttp.FAIL) 
    return next(error1);
}

//hashing password
console.log(typeof req.body.password);
const hashedpassword = await bcrypt.hash(password, 10)

const newUser = new usermodel({
    firstname,
    lastname,
    birthdate,
    phonenumber,
    cinnumber,
    address,
    city,
    email,
    password: hashedpassword,
    role,
    avatar: req.file ? req.file.filename : null
})

//generate token
const jwttoken = await generateJWT({email: newUser.email, id: newUser._id,role: newUser.role });
newUser.token = jwttoken;
await newUser.save()
res.json({status: statusHttp.SUCCESS, data : {user: newUser}})

}

const login = async(req,res,next)=>{
const {email,password} = req.body
if(!email && !password )
{
    const error = appError.create('email and password are required',400,statusHttp.FAIL)
    return next(error)
}
const checkuser = await usermodel.findOne({email: email})
if (!checkuser)
{
    const error = appError.create('user not found',400,statusHttp.FAIL)
    return next(error)
}
const matchedPassword = await bcrypt.compare(password,checkuser.password)
if (checkuser && matchedPassword)
{
    console.log(checkuser.role);
    const jwttoken = await generateJWT({email: checkuser.email, id: checkuser._id,role: checkuser.role });
 // Set an HTTP-only cookie
 
    return res.status(200).json({status: statusHttp.SUCCESS, data: {jwttoken} , user: {checkuser}})
    
}
else 
{
    const error = appError.create('something wrong',500,statusHttp.ERROR)
    return next(error)
}
}

const requestPasswordReset = async (req, res) => {
    const user = await usermodel.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send('User not found.');
    }

    const token = crypto.randomBytes(20).toString('hex');
    await usermodel.updateOne({ _id: user._id }, {
    $set: {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000
    }
});
    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    sendResetEmail(user.email, resetUrl);

    res.send('Password reset email sent.');
};

const resetPassword = async (req, res) => {
    const user = await usermodel.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).send('Password reset token is invalid or has expired.');
    }

    try {
        console.log(user)
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        await usermodel.updateOne({ _id: user._id }, {
            $set: {
                password: hashedPassword,
                resetPasswordToken: undefined,
                resetPasswordExpires: undefined
            }
        });

        res.send('Password has been reset.');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('An error occurred while resetting the password.');
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        const { email } = req.currentUser;
console.log({email});
        const user = await usermodel.findOne({ email });

        if (!user) {
            const error = appError.create('User not found', 404, statusHttp.ERROR);
            return next(error);
        }

        res.json({ status: statusHttp.SUCCESS, data: user });
    } catch (error) {
        next(error);
    }
};

const updateAccountInfo = async (req, res, next) => {
    try {
        const userEmail = req.currentUser.email;
        console.log(userEmail); // Check if userEmail is correct
        
        const updatedFields = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthdate: req.body.birthdate,
            phonenumber: req.body.phonenumber,
            city: req.body.city,
            address: req.body.address,
            // email: req.body.email  // No need to update email
        };
        
        // Check if avatar is uploaded
        if (req.file) {
            updatedFields.avatar = req.file.filename;
        }

        const updatedUser = await usermodel.findOneAndUpdate({ email: userEmail }, { $set: updatedFields }, { new: true });
        // { new: true } option ensures that the updated document is returned
        
        res.json({ status: 'success', message: 'Informations utilisateur mises à jour avec succès', data: updatedUser });
    } catch (error) {
        next(error);
    }
};
const getUserInsurances = async (req, res, next) => {
    try {
        const { email } = req.currentUser;

        // Find health insurances
        const healthInsurances = await healthInsurancemodel.find({ 'user.email': email });

        // Find project insurances
        const projectInsurances = await projectInsurancemodel.find({ 'user.email': email });

        // Find archived insurances
        const houseInsurances = await houseInsurancemodel.find({ 'user.email': email });

        // Find car insurances
        const carInsurances = await carinsurancemoidel.find({ 'user.email': email });

        // Find retraite insurances
        const retraiteInsurances = await retraiteInsurancemodel.find({ 'user.email': email });

        return res.json({
            status: statusHttp.SUCCESS,
            data: {
                healthInsurances: healthInsurances,
                projectInsurances: projectInsurances,
                carInsurances: carInsurances,
                houseInsurances: houseInsurances,
                retraiteInsurances: retraiteInsurances
            }
        });
    } catch (error) {
        next(error);
    }
};

const getInsuranceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email } = req.currentUser;
        console.log('ID:', id);
        console.log('Email:', email);

        // Find health insurance
        let insurance = await healthInsurancemodel.findOne({ _id: id, 'user.email': email });

        // If not found, find project insurance
        if (!insurance) {
            insurance = await projectInsurancemodel.findOne({ _id: id, 'user.email': email });
        }

        // If not found, find car insurance
        if (!insurance) {
            insurance = await carinsurancemoidel.findOne({ _id: id, 'user.email': email });
        }

        // If not found, find house insurance
        if (!insurance) {
            insurance = await houseInsurancemodel.findOne({ _id: id, 'user.email': email });
        }

        // If not found, find retraite insurance
        if (!insurance) {
            insurance = await retraiteInsurancemodel.findOne({ _id: id, 'user.email': email });
        }

        // If still not found, return error
        if (!insurance) {
            const error = appError.create('Insurance not found', 404, statusHttp.ERROR);
            return next(error);
        }

        return res.json({
            status: statusHttp.SUCCESS,
            data: {
                insurance: insurance
            }
        });
    } catch (error) {
        next(error);
    }
};

const archiveInsurance = async (insurance, insuranceType) => {
    const insuranceArchive = new InsuranceArchive({
        originalInsuranceId: insurance.toObject(),
        insuranceType: insuranceType,
        archivedAt: new Date()
    });

    await insuranceArchive.save();
};

const deleteInsuranceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email } = req.currentUser;

        // Find health insurance
        let insurance = await healthInsurancemodel.findOne({ _id: id, 'user.email': email });

        // If not found, find project insurance
        if (!insurance) {
            insurance = await projectInsurancemodel.findOne({ _id: id, 'user.email': email });
        }

        // If not found, find car insurance
        if (!insurance) {
            insurance = await carinsurancemoidel.findOne({ _id: id, 'user.email': email });
        }

        // If not found, find house insurance
        if (!insurance) {
            insurance = await houseInsurancemodel.findOne({ _id: id, 'user.email': email });
        }

        // If not found, find retraite insurance
        if (!insurance) {
            insurance = await retraiteInsurancemodel.findOne({ _id: id, 'user.email': email });
        }

        // If still not found, return error
        if (!insurance) {
            const error = appError.create('Insurance not found', 404, statusHttp.ERROR);
            return next(error);
        }

        // Archive the insurance
        await archiveInsurance(insurance, insurance.insuranceType);

        // Delete the insurance
        await insurance.deleteOne();

        return res.json({
            status: statusHttp.SUCCESS,
            message: 'Insurance deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
const getAllInsurances = async (req, res, next) => {
    try {
        const healthInsurances = await healthInsurancemodel.find({});
        const projectInsurances = await projectInsurancemodel.find({});
        const houseInsurances = await houseInsurancemodel.find({});
        const carInsurances = await carinsurancemoidel.find({});
        const retraiteInsurances = await retraiteInsurancemodel.find({});

        return res.json({
            status: statusHttp.SUCCESS,
            data: {
                healthInsurances,
                projectInsurances,
                houseInsurances,
                carInsurances,
                retraiteInsurances
            }
        });
    } catch (error) {
        next(error);
    }
};

const AdminGetInsuranceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('ID:', id);

        // Find health insurance
        let insurance = await healthInsurancemodel.findById(id);

        // If not found, find project insurance
        if (!insurance) {
            insurance = await projectInsurancemodel.findById(id);
        }

        // If not found, find car insurance
        if (!insurance) {
            insurance = await carinsurancemoidel.findById(id);
        }

        // If not found, find house insurance
        if (!insurance) {
            insurance = await houseInsurancemodel.findById(id);
        }

        // If not found, find retraite insurance
        if (!insurance) {
            insurance = await retraiteInsurancemodel.findById(id);
        }

        // If still not found, return error
        if (!insurance) {
            const error = appError.create('Insurance not found', 404, statusHttp.ERROR);
            return next(error);
        }

        return res.json({
            status: statusHttp.SUCCESS,
            data: {
                insurance: insurance
            }
        });
    } catch (error) {
        next(error);
    }
};

const getSinistreById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const sinistre = await Sinistre.findById(id);

        if (!sinistre) {
            const error = appError.create('Sinistre not found', 404, statusHttp.ERROR);
            return next(error);
        }

        res.status(200).json({ status: statusHttp.SUCCESS, data: sinistre });
    } catch (error) {
        next(error);
    }
};
const getTicketById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findById(id);

        if (!Contact) {
            const error = appError.create('Contact not found', 404, statusHttp.ERROR);
            return next(error);
        }

        res.status(200).json({ status: statusHttp.SUCCESS, data: contact });
    } catch (error) {
        next(error);
    }
};
const updateInsuranceToAgreement = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('Request to update insurance to Agreement for ID:', id);

        // Log the ID parameter received
        console.log('Received ID:', id);

        // Find the insurance by ID
        let insurance = await healthInsurancemodel.findById(id) ||
                        await projectInsurancemodel.findById(id) ||
                        await carinsurancemoidel.findById(id) ||
                        await houseInsurancemodel.findById(id) ||
                        await retraiteInsurancemodel.findById(id);

        // Log the result of the insurance lookup
        if (!insurance) {
            console.error('Insurance not found for ID:', id);
            return res.status(404).json({ error: 'Insurance not found' });
        }

        console.log('Insurance found:', insurance);

        // Log the state before updating
        console.log('Current state of insurance:', insurance.state);

        // Update the state to 'Agreement'
        insurance.state = 'Agreement';
        await insurance.save();

        // Log the state after updating
        console.log('Insurance state updated to Agreement for ID:', id);
        console.log('Updated state of insurance:', insurance.state);

        // Generate and send the contract
        const filePath = await generateContract(insurance);

        // Log the file path of the generated contract
        console.log('Contract generated at path:', filePath);

        console.log('Attempting to send email...');
        const linkToUploadContract = `http://localhost:3000/UploadContractForm/${insurance._id}`;
        await sendContractEmail(insurance.user, filePath, linkToUploadContract);
        console.log('Email sending attempted for user:', insurance.user.email);

        res.json({
            status: 'success',
            message: 'Insurance state updated to Agreement and contract sent to user.'
        });
    } catch (error) {
        console.error('Error in updateInsuranceToAgreement:', error);

        // Log the error stack for more details
        console.error(error.stack);

        next(error);
    }
};

const updateInsuranceContract = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email } = req.currentUser; // Assuming req.user contains the current user's info
        console.log('Request to update contract for insurance ID:', id);

        let insurance = await healthInsurancemodel.findById(id) ||
                        await projectInsurancemodel.findById(id) ||
                        await carinsurancemoidel.findById(id) ||
                        await houseInsurancemodel.findById(id) ||
                        await retraiteInsurancemodel.findById(id);

        if (!insurance) {
            return res.status(404).json({ error: 'Insurance not found' });
        }

        console.log('Insurance found:', insurance);

        if (insurance.user.email !== email) {
            return res.status(403).json({ error: 'Unauthorized: Email does not match' });
        }

        console.log('Email verified. Updating contract...');

        insurance.contrat = req.file.path;
        await insurance.save();
        await sendAdminNotification(insurance.user, id, req.file.path);

        res.json({
            status: 'success',
            message: 'Insurance contract updated successfully.',
            contractPath: insurance.contrat
        });
    } catch (error) {
        console.error('Error in updateInsuranceContract:', error);
        next(error);
    }
};
const updateInsuranceStateToNotPaid = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('Request to update state to Not Paid for insurance ID:', id);

        let insurance = await healthInsurancemodel.findById(id) ||
                        await projectInsurancemodel.findById(id) ||
                        await carinsurancemoidel.findById(id) ||
                        await houseInsurancemodel.findById(id) ||
                        await retraiteInsurancemodel.findById(id);

        if (!insurance) {
            return res.status(404).json({ error: 'Assurance non trouvée' });
        }

        console.log('Assurance trouvée:', insurance);

        insurance.state = 'Not paid';
        insurance.countingDate = new Date();
        await insurance.save();

        res.json({
            status: 'success',
            message: 'État de l\'assurance mis à jour avec succès en "Not Paid".',
            insurance
        });
    } catch (error) {
        console.error('Erreur dans updateInsuranceStateToNotPaid:', error);
        next(error);
    }
};

const updateInsuranceStateToRefused = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('Request to update insurance state for ID:', id);

        let insurance = await healthInsurancemodel.findById(id) ||
                        await projectInsurancemodel.findById(id) ||
                        await carinsurancemoidel.findById(id) ||
                        await houseInsurancemodel.findById(id) ||
                        await retraiteInsurancemodel.findById(id);

        if (!insurance) {
            return res.status(404).json({ error: 'Insurance not found' });
        }

        console.log('Insurance found:', insurance);

        if (insurance.state === 'Agreement') {
            console.log('Insurance state is already Agreement, no change needed.');
            await sendInsuranceNotification(insurance.user, 'Agreement');

        } else if (insurance.state === 'Treatement') {
            insurance.state = 'refused';
            await insurance.save();
            console.log('Insurance state updated to Refused for ID:', id);
            await sendInsuranceNotification(insurance.user, 'Treatement');

            await insurance.deleteOne();
            console.log('Insurance document deleted for ID:', id);

        } else {
            console.log('Insurance state is neither Agreement nor Treatement, no change made.');
        }

        res.json({
            status: 'success',
            message: 'Insurance state checked and updated if necessary and insurance deleted if set to Refused.'
        });
    } catch (error) {
        console.error('Error in updateInsuranceStateToRefused:', error);
        next(error);
    }
};


const updateInsurancePrice = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { price } = req.body;
const {modeDePaiement} = req.body
        if (!price) {
            return res.status(400).json({ error: 'Price is required' });
        }

        console.log('Request to update price for insurance ID:', id);

        let insurance = await healthInsurancemodel.findById(id) ||
                        await projectInsurancemodel.findById(id) ||
                        await carinsurancemoidel.findById(id) ||
                        await houseInsurancemodel.findById(id) ||
                        await retraiteInsurancemodel.findById(id);

        if (!insurance) {
            return res.status(404).json({ error: 'Insurance not found' });
        }

        console.log('Insurance found:', insurance);

        // Update the price
        insurance.price = price;
        insurance.modeDePaiement = modeDePaiement
        await insurance.save();

        console.log('Insurance price updated for ID:', id);

        res.json({
            status: 'success',
            message: 'Insurance price updated successfully.',
            insurance
        });
    } catch (error) {
        console.error('Error in updateInsurancePrice:', error);
        next(error);
    }
};

const updateInsurancePayment = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the insurance ID from URL parameters
        const { amount } = req.body; // Get the amount to subtract from request body
        console.log('Request to update insurance payment for ID:', id);

        let insurance = await healthInsurancemodel.findById(id) ||
                        await projectInsurancemodel.findById(id) ||
                        await carinsurancemoidel.findById(id) ||
                        await houseInsurancemodel.findById(id) ||
                        await retraiteInsurancemodel.findById(id);

        if (!insurance) {
            return res.status(404).json({ error: 'Insurance not found' });
        }

        console.log('Insurance found:', insurance);
        if (insurance.firststepPaiement === 0) {
            insurance.firststepPaiement = 1;
        }
        let remainingAmount = (insurance.Paiement_rest === 0 && insurance.price !== 0) 
        ? (insurance.price - amount) 
        : (insurance.Paiement_rest !== 0 && insurance.price !== 0) 
            ? (insurance.Paiement_rest - amount) 
            : 0;        insurance.Paiement_rest = remainingAmount;

        if (insurance.price !== 0 && remainingAmount === 0) {
            insurance.state = 'paid';
        }

        await insurance.save();
        console.log('Insurance payment updated for ID:', id);

        res.json({
            status: 'success',
            message: 'Insurance payment updated successfully.',
            Paiement_rest: remainingAmount
        });
    } catch (error) {
        console.error('Error in updateInsurancePayment:', error);
        next(error);
    }
};


const updateInsurances = async () => {
    try {
        console.log('Running insurance update process...');

        const models = [
            healthInsurancemodel,
            projectInsurancemodel,
            carinsurancemoidel,
            houseInsurancemodel,
            retraiteInsurancemodel
        ];

        const currentDate = new Date();

        for (const model of models) {
            const insurances = await model.find({ state: { $in: ['paid', 'Not paid'] } });

            for (const insurance of insurances) {
                const countingDate = new Date(insurance.countingDate);
                const monthsDiff = (currentDate.getFullYear() - countingDate.getFullYear()) * 12 + (currentDate.getMonth() - countingDate.getMonth());

                console.log(`Insurance ID: ${insurance._id}, Mode: ${insurance.modeDePaiement}, Months Diff: ${monthsDiff}`);

                if (insurance.modeDePaiement === 'trimestre' && monthsDiff >= 3) {
                    insurance.Paiement_rest += insurance.price;
                    insurance.state = 'Not paid';
                    insurance.countingDate = currentDate;  // Update countingDate to current date
                    await insurance.save();
                    console.log(`Updated insurance ID: ${insurance._id} for trimestre mode`);
                } else if (insurance.modeDePaiement === 'semestriel' && monthsDiff >= 6) {
                    insurance.Paiement_rest += insurance.price;
                    insurance.state = 'Not paid';
                    insurance.countingDate = currentDate;  // Update countingDate to current date
                    await insurance.save();
                    console.log(`Updated insurance ID: ${insurance._id} for semestriel mode`);
                }
            }
        }

        console.log('Insurance update process completed.');
    } catch (error) {
        console.error('Error in updateInsurances:', error);
    }
};
const updateSoldeAndDeleteSinistre = async (req, res, next) => {
    try {
        const { userId, sinistreId } = req.params; // Get userId and sinistreId from URL parameters
        const { amount } = req.body; // Get the amount from request body

        // Validate the amount
        if (typeof amount !== 'number' || isNaN(amount)) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Find the user and update their soldeRemboursement
        let user = await usermodel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.soldeRemboursement = (user.soldeRemboursement || 0) + amount;
        await user.save();

        // Delete the sinistre
        let sinistre = await Sinistre.findById(sinistreId);
        if (!sinistre) {
            return res.status(404).json({ error: 'Sinistre not found' });
        }

        sinistre.state = 'accepted'
        sinistre.save();
        await sendReimbursementEmail(user, amount);

        res.json({
            status: 'success',
            message: 'Solde updated and sinistre deleted successfully.',
        });
    } catch (error) {
        console.error('Error in updateSoldeAndDeleteSinistre:', error);
        next(error);
    }
};
const updateSinistreToRefused = async (req, res, next) => {
    try {
        const { userId, sinistreId } = req.params;

        let user = await usermodel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let sinistre = await Sinistre.findById(sinistreId);
        if (!sinistre) {
            return res.status(404).json({ error: 'Sinistre not found' });
        }

        sinistre.state = 'refused';
        await sinistre.save();

        await sendRefusalEmail(user, sinistre);

        res.json({
            status: 'success',
            message: 'Sinistre refused successfully.',
        });
    } catch (error) {
        console.error('Error in updateSinistreToRefused:', error);
        next(error);
    }
};
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params; // Get user ID from URL parameters
        const user = await usermodel.findById(id); // Find user by ID and select specific fields

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ status: statusHttp.SUCCESS, data: user });

 
    } catch (error) {
        console.error('Error in getUserById:', error);
        next(error);
    }
};


const addMessageToContact = async (req, res, next) => {
    try {
        const { id } = req.params; // Contact ID from URL parameters
        const { message } = req.body; // Message from request body
        const { email } = req.currentUser;
        console.log({email});
                const user = await usermodel.findOne({ email });
        
                

        // Find the contact by ID
        let contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Determine the sender
        const sender = user.role === 'ADMIN' ? 'Admin' : `${contact.firstname} ${contact.lastname}`;

        // Create the new message object
        const newMessage = {
            message: message,
            sender: sender,
            date: new Date()
        };

        // Add the new message to the contact's messages list
        contact.messages.push(newMessage);

        // Save the updated contact
        await contact.save();
        const url = `http://localhost:3000/userticketdetails/${contact._id}`
        await sendNotificationEmail(contact.email, `Nouveau message sur votre ticket: ${contact.Subject}`, message, sender, url);

        return res.json({
            status: statusHttp.SUCCESS,
            message: 'Message added to contact successfully',
            data: contact
        });
    } catch (error) {
        console.error('Error in addMessageToContact:', error);
        next(error);
    }
};
const addMessageToContactAsUser = async (req, res, next) => {
    try {
        const { id } = req.params; // Contact ID from URL parameters
        const { message } = req.body; // Message from request body

        // Find the contact by ID
        let contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Create the new message object
        const newMessage = {
            message: message,
            sender: `${contact.firstname} ${contact.lastname}`,
            date: new Date()
        };

        // Add the new message to the contact's messages list
        contact.messages.push(newMessage);

        // Save the updated contact
        await contact.save();

        return res.json({
            status: statusHttp.SUCCESS,
            message: 'Message added to contact successfully',
            data: contact
        });
    } catch (error) {
        console.error('Error in addMessageToContactAsUser:', error);
        next(error);
    }
};
const updateTicketState = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the ticket ID from URL parameters
        const { state } = req.body; // Get the new state from request body

        // Find the ticket by ID
        let ticket = await Contact.findById(id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Update the ticket state
        ticket.state = state;
        await ticket.save();

        return res.json({
            status: statusHttp.SUCCESS,
            message: 'Ticket state updated successfully',
            data: ticket
        });
    } catch (error) {
        console.error('Error in updateTicketState:', error);
        next(error);
    }
};
module.exports={
    getallusers,
    register,
    login,
    requestPasswordReset,
    resetPassword,
    getUserProfile,
    updateAccountInfo,
    getUserInsurances,
    getInsuranceById,
    deleteInsuranceById,
    getAllInsurances,
    AdminGetInsuranceById,
    getSinistreById,
    getTicketById,
    updateInsuranceToAgreement,
    updateInsuranceContract,
    updateInsuranceStateToNotPaid,
    updateInsuranceStateToRefused,
    updateInsurancePrice,
    updateInsurancePayment,
    updateInsurances,
    updateSoldeAndDeleteSinistre,
    updateSinistreToRefused,
    getUserById,
    addMessageToContact,
    addMessageToContactAsUser,
    updateTicketState
}