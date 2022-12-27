const express = require('express');
const admin_route = express();
const session = require('express-session')
admin_route.use(session({
    secret: "heyboi",
    cookie:{
        maxAge:6000000
    }, 
    resave:true,
    saveUninitialized:true

}))


const userController = require('../controllers/adminController');

admin_route.get('/', userController.loadAdminLogin);


admin_route.get('*', function(req, res){
res.redirect('/admin')
})


module.exports = admin_route;