var jwt = require('jsonwebtoken')
module.exports = async (payload) =>{

    const  jwttoken = await jwt.sign(payload,process.env.token)
return jwttoken;

}

