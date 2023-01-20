const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

user: {
    type: mongoose.Schema.Types.ObjectId,
    refer: 'User',
    required: true
},

items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0
    },
  
address: {
    type: mongoose.Schema.Types.ObjectId,
    refer: 'Address'
},
totalPrice: Number,

orderStat: {
    type: String, 
    required: true
},   
paymentMethod:{
    type: String,
    required: true
},



},{timestamps: true})



const Order = mongoose.model("Order", orderSchema)
module.exports = Order