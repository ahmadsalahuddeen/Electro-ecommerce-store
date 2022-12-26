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


const loadLogin = async (req,res) =>{
    res.render('login')
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
                res.render('home', {message: "Your account added succefully, Please verify your OTP"}) 
                  
              } else {
          res.render('userRegister', {message: "user insert failed"})        
              }
          } catch (error) {
              console.log(error.message);
                  
          }
}

const loginValidate = async (req, res)=> {
    
    try {
        console.log(email =  req.body.email); 
        const password = req.body.password;
        const userData = await User.findOne({email: email});
        console.log(userData);
        if (userData) {
            console.log('got user');
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                
                req.session.user = userData;
                console.log(` sesssion testing ${req.session.user}`);
                res.render('home')
            } else {
                res.render('login', {message: "incorrect password"})
            }

           
        } else {
            
            res.render('login', {message: "invalid email or password"})
        }

    } catch (error) {
        console.log(error.message);
        
    }
   

}


const loadHome = async(req, res)=>{
res.render('home');
}


const logOut = async (req, res)=>{
    req.session.destroy();
    res.redirect('/');
}



module.exports = {
    loadRegister,
    addUser,
    loadLogin,
    loginValidate,
    loadHome,
    logOut
    
}
