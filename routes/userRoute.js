
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

userRoute.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Expires', '-1')
  res.header('Pragma', 'no-cache')
  next()
})
userRoute.get('/', function (req, res) {
  res.redirect('/login')
})

userRoute.get('/register', userController.loadRegister)
userRoute.post('/register', upload.single('image'), userController.addUser)
userRoute.get('/login', userController.loadLogin)
userRoute.post('/login', userController.loginValidate)
userRoute.get('/home', userController.loadHome)
// userRoute.get('/productList', userController.loadProductList)
userRoute.get('/logout', userController.logOut)

module.exports = userRoute
