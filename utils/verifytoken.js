const jwt = require('jsonwebtoken');
const appError = require('./appError');
const httpStatusText = require('../utils/httpstatustext')
const verifyToken =(req,res,next) =>
{
    const authHeader = req.headers.authorization
if(!authHeader)
{
    const error = appError.create('token is required', 401, httpStatusText.ERROR)
        return next(error);
}
   const token = authHeader.split(' ')[1];
   try{
    const currentUser =  jwt.verify(token, process.env.token);
    req.currentUser = currentUser;
    next();
   }
   catch(err)
   {
    const error = appError.create('invalid token', 401, httpStatusText.ERROR)
        return next(error);
   }
   
}
module.exports = verifyToken;