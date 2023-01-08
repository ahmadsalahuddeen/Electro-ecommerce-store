const { response } = require("express");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },  
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  cart: {
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
  },
  mobile: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  access: {
    type: Boolean,
    default: true,
  },
});

UserSchema.methods.addToCart = function (product, cb) {
  const cart = this.cart;
  const isProductExist = cart.items.findIndex(
    (itemsproduct) =>
      new String(itemsproduct.product).trim() === new String(product._id).trim()
  );

  if (isProductExist >= 0) {
    cart.items[isProductExist].qty += 1;
  } else {
    cart.items.push({ product: product._id, qty: 1 });
  }

  cart.totalPrice += product.discount;
  this.save().then((doc)=>{
     response.cartLength = doc.cart.items.length
     response.totalPrice = doc.cart.totalPrice
     cb(response)

  });
};

UserSchema.methods.changeQuantity = (product, count, qty, cb )=>{
const cart = this.cart
const response = {}
const key = parseInt(count)
const currentQuantity = parseInt(qty)
const itemId = cart.items.findIndex(element => {element.product._id == product})

if (key === -1 && currentQuantity === 1) {
  cart.totalPrice -= product.discount 
  cart.items.splice(itemId, 1)
  response.remove = true
  
} else if(key === -1){
  cart.items[itemId].qty -= 1
  cart.totalPrice -= product.discount
 
  response.newQuantityCount = cart.items[itemId].qty  
} else if(key === 1){
  cart.items[itemId].qty +=  1
  cart.totalPrice += product.discount
  response.newQuantityCount = cart.items[itemId].qty  
}

this.save().then((doc)=>{
  response.totalPtice = doc.cart.totalPrice
  response.cartLength = doc.cart.length
  cb(response)
})
}

const User = mongoose.model("User", UserSchema);

module.exports = User;
