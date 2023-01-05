
const express = require('express')
const multer = require('multer')
const userRoute = express()
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname, '../public/userImages'))
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '' + file.originalname
    cb(null, name)
  }
})

const upload = multer({ storage })

const userController = require('../controllers/userController')
const auth = require('../middleware/adminAuth')
userRoute.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate') 
  res.header('Expires', '-1')
  res.header('Pragma', 'no-cache')
  next()
})
userRoute.get('/', function (req, res) {
  res.redirect('/login')
})

userRoute.get('/register', auth.isUserLogout, userController.loadRegister)
userRoute.post('/register', userController.addUser)
userRoute.get('/login', auth.isUserLogout, userController.loadLogin)
userRoute.post('/login', userController.loginValidate)
userRoute.get('/home', auth.isUserLogin, userController.loadHome)
userRoute.get('/productlist', auth.isUserLogin, userController.loadProductList)
userRoute.get('/logout', auth.isUserLogout, userController.logOut)
userRoute.post('/addtocart', userController.addToCart)

module.exports = userRoute
