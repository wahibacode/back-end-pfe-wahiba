/*const fs = require('node:fs')
//read file blocking code(nothing won't happen until readFileSync finishes its work )
const filecontent = fs.readFileSync('./hello.txt', 'utf-8')
console.log(filecontent)
//read file non-blocking code( things after readfile function can be done before readfile function: in fact readfile is sent to something called "event loop to be cared" then the main thread call the event loop to take his function's results )
const filecontent1 =fs.readFile('./hello.txt','utf-8',(err,data)=>{
    if(err) console.log(err)
    else  console.log(data)
})

//stream 
const rstream = fs.createReadStream('./hello.txt','utf8')
const wstream =fs.createWriteStream('./zeby.txt','utf-8')
rstream.on('data',(chunk)=>{
    console.log('\n=======chunk======\n',chunk)
    wstream.write(chunk)
})*/

require('dotenv').config()
const retraiteapis = require('./routes/retraiteroute');
const statisticsapis = require('./routes/StatisticsRoute');
const nodemailer = require("nodemailer");
const cors = require('cors')
const statusHttp = require('./utils/httpstatustext')
const coursesapis = require('./routes/courseroute')
const userapis = require('./routes/userroute')
const contactapis = require('./routes/contactroute')
const healthInsuranceapis = require('./routes/healthinsuranceroute')
const carInsuranceapis= require('./routes/carInsuranceorute')
const houseInsuranceapis = require('./routes/houseinsuranceroute')
const express = require('express');
const projectInsuranceapis = require('./routes/projectroute')
const sinistreapis = require('./routes/sinistreroute')
const url= process.env.DB_URL;
console.log(url)
const mongoose = require('mongoose');
const path = require('path')
const sendContractEmail = require('./utils/sendContractEmail'); 
const userController = require('./controllers/usercontroller');
mongoose.connect(url).then(()=> {
    console.log("databaase connected successfully");

    userController.updateInsurances();

})
//cors npm package enabling calling the origins (api routes) from frontend without geting blocked
const hostname = '127.0.0.1'
const app = express()
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    optionsSuccessStatus: 200,
    credentials: true
}));
app.use('/uploads/avatar',express.static(path.join(__dirname,'uploads/avatar')));
app.use('/uploads/car',express.static(path.join(__dirname,'uploads/car')));
app.use('/uploads/house',express.static(path.join(__dirname,'uploads/house')));
app.use('/uploads/health',express.static(path.join(__dirname,'uploads/health')));
app.use('/uploads/sinistre',express.static(path.join(__dirname,'uploads/sinistre')));
app.use('/uploads/projet/photo',express.static(path.join(__dirname,'uploads/projet/photo')))
app.use('/uploads/projet/document',express.static(path.join(__dirname,'uploads/projet/document')))
app.use('/uploads/contrat',express.static(path.join(__dirname,'uploads/contrat')))

app.use('/uploads/retraite/extraitDeNaissance',express.static(path.join(__dirname,'uploads/retraite/extraitDeNaissance')))
app.use('/uploads/retraite/preuveDActivite',express.static(path.join(__dirname,'uploads/retraite/preuveDActivite')))
app.use('/uploads/retraite/cin',express.static(path.join(__dirname,'uploads/retraite/cin')))





app.use(express.json())
app.use('/api/courses',coursesapis);
app.use('/api/users',userapis);
app.use('/api/contact',contactapis)
app.use('/api/houseInsurance',houseInsuranceapis)
app.use('/api/projectInsurance',projectInsuranceapis);
app.use('/api/carInsurance',carInsuranceapis)
app.use('/api/healthInsurance',healthInsuranceapis)
app.use('/api/sinistre',sinistreapis)
app.use('/api/retraite', retraiteapis);
app.use('/api/stats', statisticsapis);


// Test email route
app.get('/test-email', async (req, res, next) => {
    try {
        console.log('Test email endpoint hit');
        const user = {
            email: 'azizsmati44@gmail.com' // Replace with the actual recipient email
        };
        const filePath = path.join(__dirname, 'contracts', 'testfile.pdf'); // Ensure this file exists
        await sendContractEmail(user, filePath);
        res.json({ message: 'Test email sent successfully' });
    } catch (error) {
        console.error('Error in test-email route:', error);
        next(error);
    }
});

app.all('*',(req,res,next)=>{
    res.status(404).json({status: statusHttp.ERROR, message:'this ressource is not available'});
})



console.log(process.env.PORT);

app.listen(process.env.PORT,hostname, ()=>{
    console.log(`server running at http://:/`)
})