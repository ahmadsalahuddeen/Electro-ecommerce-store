const { channel } = require('diagnostics_channel');
const express = require('express');
const multer = require('multer');
const user_route = express();
const path = require('path');





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
user_route.get('/register', userController.loadRegister);
user_route.post('/register', upload.single('image'), userController.addUser)
user_route.get('/', userController.loadLogin)
user_route.get('/login', userController.loadLogin)
user_route.post('/login', userController.loginValidate)
user_route.get('/home', userController.loadHome)








module.exports = user_route;