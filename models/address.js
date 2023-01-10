const mongoose = require('mongoose');
const { Refer } = require('twilio/lib/twiml/VoiceResponse');

const addressSchema = new mongoose.Schema({
    add: { type:[
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
    ],
required: true
},
    user: {
type: mongoose.Schema.Types.ObjectId,
refer: 'User',
required: true
    }
})


const Address = mongoose.model("Address", addressSchema)

module.exports = Address;
