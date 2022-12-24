const User = require('../models/userModel');
const bcrypt = require('bcrypt');


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
    
}
