const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true

    },
    password:{
        type: String, 
        required: true
    },
    is_admin:{
        type: Number,
        required: true
    },
    is_verified:{
        type: Number,
        default: 0
    }
   
})

const User = mongoose.model("User", UserSchema)

module.exports = User;
