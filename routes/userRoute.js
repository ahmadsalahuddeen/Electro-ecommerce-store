const { channel } = require('diagnostics_channel');
const express = require('express');
const multer = require('multer');
const user_route = express();
const path = require('path');

const session = require('express-session')
user_route.use(session({
    secret: "heyboi",
    cookie:{
        maxAge:6000000000
    }, 
    resave:true,
    saveUninitialized:true

}))

const storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null, path.join(__dirname , '../public/userImages'))
    },
    filename: function(req, file, cb){
        const name = Date.now()+ ' '+ file.originalname;
        cb(null, name);
     }
})

const upload = multer({storage:storage})

const userController = require('../controllers/userController');
const auth = require('../middleware/auth');



user_route.get('/register',auth.isLogout, userController.loadRegister);
user_route.post('/register',upload.single('image'), userController.addUser)
user_route.get('/', auth.isLogout, userController.loadLogin)
user_route.get('/login',auth.isLogout, userController.loadLogin)
user_route.post('/login', userController.loginValidate)
user_route.get('/home', auth.isLogin, userController.loadHome)
user_route.get('/logout', auth.isLogin, userController.logOut)








module.exports = user_route;