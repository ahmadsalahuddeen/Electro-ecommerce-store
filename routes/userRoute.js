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








module.exports = user_route;