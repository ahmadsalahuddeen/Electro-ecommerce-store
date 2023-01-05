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

UserSchema.methods.addToCart = function (product) {
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
  return this.save();
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
