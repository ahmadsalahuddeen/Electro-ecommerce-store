const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config({path: './config/.env'})



//---------------------------------------------
const PORT  = process.env.PORT || 4000;

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true}, (err) => {
    if(err){
        console.log('Database connection failed')   
    }else{
        console.log("DB connected succefully");
    }
});



//------------------------------------------------


















app.listen()