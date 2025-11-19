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

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const retraiteapis = require('./routes/retraiteroute');
const statisticsapis = require('./routes/StatisticsRoute');
const coursesapis = require('./routes/courseroute');
const userapis = require('./routes/userroute');
const contactapis = require('./routes/contactroute');
const healthInsuranceapis = require('./routes/healthinsuranceroute');
const carInsuranceapis = require('./routes/carInsuranceorute');
const houseInsuranceapis = require('./routes/houseinsuranceroute');
const projectInsuranceapis = require('./routes/projectroute');
const sinistreapis = require('./routes/sinistreroute');
const sendContractEmail = require('./utils/sendContractEmail'); 
const userController = require('./controllers/usercontroller');
const statusHttp = require('./utils/httpstatustext');

// ---------------- MONGODB ----------------
mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("Database connected successfully");
        userController.updateInsurances();
    })
    .catch(err => console.log(err));

const app = express();

// --------- CORS setup -----------
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// ---------- STATIC FILES ----------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- BODY PARSER ----------
app.use(express.json());

// ---------- ROUTES ----------
app.use('/api/courses', coursesapis);
app.use('/api/users', userapis);
app.use('/api/contact', contactapis);
app.use('/api/houseInsurance', houseInsuranceapis);
app.use('/api/projectInsurance', projectInsuranceapis);
app.use('/api/carInsurance', carInsuranceapis);
app.use('/api/healthInsurance', healthInsuranceapis);
app.use('/api/sinistre', sinistreapis);
app.use('/api/retraite', retraiteapis);
app.use('/api/stats', statisticsapis);

// ---------- ROOT ROUTE ----------
app.get('/', (req, res) => {
    res.send("API is running successfully 🚀");
});

// ---------- 404 HANDLER ----------
app.all('*', (req, res) => {
    res.status(404).json({
        status: statusHttp.ERROR,
        message: 'This resource is not available'
    });
});

// ---------- SERVER ----------
const PORT = process.env.PORT || 7666;
const HOST = "0.0.0.0";  // REQUIRED FOR DEPLOYMENT

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});