const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const {TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,TWILIO_SERVICE_SID} = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN , {
    lazyLoading: true
})


const sendOTP = async (req,res, next)=>{
    const phoneNumber = req.body.mobile;
    // const countryCode = +91;

try {
    

const otpResponse = await client.verify
.services(TWILIO_SERVICE_SID)
.verifications.create({
    to: `+91${phoneNumber}`,
    channel: "sms",
});
res.status(200).send(`OTP send succesdfully: ${JSON.stringify(otpResponse)}`)

} catch (error) {
    res.status(error?.status || 400).send(error?.message || `something went wrong`);
}
}

const verifyOTP = async (req, res, next)=>{
    const {phoneNumber, otp} = req.body;
    try {
        const verifiedResponse = await client.verify
        .services(TWILIO_SERVICE_SID)
        .verificationChecks.create({
            to: `+91${phoneNumber}`,
            code: otp,
        })
        res.status(200).send(`OTP verified succesfully: ${JSON.stringify( verifiedResponse)}`)
        
    } catch (error) {
        
        res.status(error?.status || 400 ).send(error?.message || `something went wrong`);
    }

}



const loadRegister = async(req, res)=>{
    try {
        res.render(
        'userRegister'
        )
    } catch (error) {
        console.log(error.message);
    }
}
const secretPassword = async(password)=>{
  try {
     const secretpassword = await bcrypt.hash(password, 10)
  return secretpassword
} catch (error) {
    console.log(error.message);
}
}

const addUser = async(req, res)=>{
    try {
        const sPassword = await secretPassword(req.body.password)
          const user = User({
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          image:req.file.filename,
          password: sPassword,
          is_admin: 0
              })
              const userData = await user.save();
          
              if (userData) {
                res.render('userRegister', {message: "Your account added succefully, Please verify your OTP"}) 
                  
              } else {
          res.render('userRegister', {message: "user insert failed"})        
              }
          } catch (error) {
              console.log(error.message);
                  
          }
}




module.exports = {
    loadRegister,
    addUser,
    verifyOTP,
    sendOTP
    
}
