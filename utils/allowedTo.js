const appError = require('./appError')
const statusHttp = require('./httpstatustext')
module.exports = (...roles) =>
{

    return (req,res,next)=>{
//console.log("roles",roles)
//next();
if(!roles.includes(req.currentUser.role))
{
    console.log('okhrej nayek');
    return next(appError.create("this role is not authorized",401,statusHttp.ERROR))
}
next();
    }
}