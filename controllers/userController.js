const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const Product = require('../models/poductModel')
const { findByIdAndUpdate } = require('../models/userModel')

const loadRegister = async (req, res) => {
  if (req.session.isLoggedIn === true) {
    res.redirect('/home')
  } else {
    res.render(
      'userRegister'
    )
  }
} 

const secretPassword = async (password) => {
  try {
    const secretpassword = await bcrypt.hash(password, 10)
    return secretpassword
  } catch (error) {
    console.log(error.message)
  }
}

const loadLogin = async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render('login')
  } else {
    res.redirect('/home')
  }
}

const addUser = async (req, res) => {
  try {
    if (req.body.password === req.body.confirmpassword) {
      const sPassword = await secretPassword(req.body.password)
   
      const user = User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        
        password: sPassword

      })
      const userData = await user.save()

      if (userData) {
        req.session.isLoggedIn = true
        req.session.user = userData
        res.redirect('/home')
      }
    } else {
      res.render('userRegister', { message: 'Incorrect passoword' })
    }
  } catch (error) {
    console.log(error.message)
  }
}

const logOut = async (req, res) => {
  req.session.destroy()
  res.redirect('/')
}

const loginValidate = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const userData = await User.findOne({ email })

    if (userData) {
      console.log('got user')
      const passwordMatch = await bcrypt.compare(password, userData.password)
      if (passwordMatch) {
        if (userData.access) {
          req.session.isLoggedIn = true
          req.session.user = userData

          console.log(` sesssion isloggein created: ${userData}`)
          res.redirect('/home')
        } else {
          res.render('login', { message: 'Your access in blocked by ADMIN' })
        }
      } else {
        res.render('login', { message: 'incorrect password' })
      }
    } else {
      res.render('login', { message: 'invalid email or password' })
    }
  } catch (error) {
    console.log(error.message)
  }
}

const loadHome = async (req, res) => {
  if (req.session.isLoggedIn) {
    res.render('home')
  } else {
    res.redirect('/login')
  }
}
const loadProductList = async(req, res)=>{
  const product = await Product.find()
  res.render('productlist' ,{product})
}

const addCart = async(req, res) =>{
  userId = '63b63264870b02d32a5b114c'
Product.findById(req.body.id)
.then(product =>{
  id.addToCart(product)
  res.redirect('/productlist')
})

}



module.exports = {
  loadRegister,
  addUser,
  loadLogin,
  loginValidate,
  loadHome,
  logOut,
  loadProductList,
  addCart,

}

// const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env
// const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
//   lazyLoading: true
// })

// const sendOTP = async (req, res, next) => {
//   const phoneNumber = req.body.mobile
//   // const countryCode = +91;

//   try {
//     const otpResponse = await client.verify
//       .services(TWILIO_SERVICE_SID)
//       .verifications.create({
//         to: `+91${phoneNumber}`,
//         channel: 'sms'
//       })
//     res.status(200).send(`OTP send succesdfully: ${JSON.stringify(otpResponse)}`)
//   } catch (error) {
//     res.status(error?.status || 400).send(error?.message || 'something went wrong')
//   }
// }

// const verifyOTP = async (req, res, next) => {
//   const { phoneNumber, otp } = req.body
//   try {
//     const verifiedResponse = await client.verify
//       .services(TWILIO_SERVICE_SID)
//       .verificationChecks.create({
//         to: `+91${phoneNumber}`,
//         code: otp
//       })
//     res.status(200).send(`OTP verified succesfully: ${JSON.stringify(verifiedResponse)}`)
//   } catch (error) {
//     res.status(error?.status || 400).send(error?.message || 'something went wrong')
//   }
// }
