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
          refer: "Product",
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

UserSchema.methods.addToCart = function(product){
  
}

const User = mongoose.model("User", UserSchema);

module.exports = User;
