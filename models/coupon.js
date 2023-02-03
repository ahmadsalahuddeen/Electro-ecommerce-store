const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    usedUsers: [{
type: mongoose.Schema.Types.ObjectId,
required: true,
ref: 'User'
}],
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    minCartAmount: {
        type: Number,
        required: true
    },
    discountAmount: {
        type: Number,
        required: true
    },
    expiryDate:{
        type: Date,
        required: true
    } ,
    startDate: Date,
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: String,
        default: true
    }



}, {timestamps: true})


const Coupon = mongoose.model("Coupon", couponSchema)

module.exports = Coupon
