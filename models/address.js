const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    address: [
        {
            name: {
                type: String,
                required: true
            },
            mobile: {
                type: String,
                required: true
            },
            pincode: {
                type: String,
                required: true
            },
            district: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            fullAddress: {
                type: String,
                required: true
            },
            landmark: {
                type: String,
                required: true
            }
        }
    ]
})


const Address = mongoose.model("Address", addressSchema)

module.exports = Address;
