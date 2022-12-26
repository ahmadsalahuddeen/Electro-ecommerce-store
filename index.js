const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config({path: './config/.env'})
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcrypt');
const session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set(express.static('public'))


app.use(session({
    secret: "heyboi",
    cookie:{
        maxAge:6000000
    }, 
    resave:true,
    saveUninitialized:true

}))
//---------------------------------------------
const PORT  = process.env.PORT || 4000;

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true}, (err) => {
    if(err){
        console.log('Database connection failed')   
    }else{
        console.log("DB connected succefully");
    }
});

app.set(express.static(`${__dirname}/public`))
app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.use(express.static('public'))
// app.use('/twilio-sms', twilioRouter)
const user_route = require('./routes/userRoute');

app.use('/', user_route)















app.listen(PORT, ()=> {
    console.log(`server started on http://localhost:${PORT}/`)
})

















