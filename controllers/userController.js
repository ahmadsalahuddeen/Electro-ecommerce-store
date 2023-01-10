const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Product = require("../models/poductModel");
const { response, render } = require("../routes/userRoute");
const { findById, find } = require("../models/userModel");
const Address = require('../models/address');


const loadRegister = async (req, res) => {
  if (req.session.isLoggedIn === true) {
    res.redirect("/home");
  } else {
    res.render("userRegister");
  }
};

const secretPassword = async (password) => {
  try {
    const secretpassword = await bcrypt.hash(password, 10);
    return secretpassword;
  } catch (error) {
    console.log(error.message);
  }
};

const loadLogin = async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("login");
  } else {
    res.redirect("/productlist");
  }
};

const addUser = async (req, res) => {
  try {
    if (req.body.password === req.body.confirmpassword) {
      const sPassword = await secretPassword(req.body.password);

      const user = User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,

        password: sPassword,
      });
      const userData = await user.save();

      if (userData) {
        req.session.isLoggedIn = true;
        req.session.user = userData;
        req.session.cartLength = userData.cart.items.length
          req.session.cartTotalPrice = userData.cart.totalPrice
        res.redirect("/home");
      }
    } else {
      res.render("userRegister", { message: "Incorrect passoword" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const logOut = async (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

const loginValidate = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email });

    if (userData) {
      console.log("got user");
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.access) {
          req.session.isLoggedIn = true;
          req.session.user = userData;
          req.session.cartLength = userData.cart.items.length
          req.session.cartTotalPrice = userData.cart.totalPrice

          console.log(` sesssion isloggein created: ${userData}`);
          res.redirect("/home");
        } else {
          res.render("login", { message: "Your access in blocked by ADMIN" });
        }
      } else {
        res.render("login", { message: "incorrect password" });
      }
    } else {
      res.render("login", { message: "invalid email or password" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  if (req.session.isLoggedIn) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
};
const loadProductList = async (req, res) => {
  const user = await User.findById(req.session.user).populate(
    "cart.items.product"
  );

  const product = await Product.find();
  res.render("productlist", { product, user });
};

const addToCart = async (req, res) => {
  const useer = await User.findById(req.session.user._id);
  console.log(useer);
  const productId = req.query.id;

  Product.findById(req.body.productid)
    .then((product) => {
      useer.addToCart(product, (response) => {
        console.log(response);
        res.json(response);
      });
    })
    .catch((err) => console.log(err));
};

const loadCartManage = async (req, res) => {
  try {
    const user = await User.findById(req.session.user).populate(
      "cart.items.product"
    );
    res.render("cartmanage", { user });
  } catch (e) {
    console.log(e.message);
  }
};

const removeCartItem = async (req, res) => {
  const productId = req.query.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  const product = await Product.findById(productId);
  const itemId = user.cart.items.findIndex(
    (itemsproduct) =>
      new String(itemsproduct.product).trim() === new String(productId).trim()
  );

  const itemPrice = product.discount * user.cart.items[itemId].qty;

  const newTotalPrice = user.cart.totalPrice - itemPrice;

  User.findByIdAndUpdate(
    { _id: userId },
    { $pull: { "cart.items": { product: productId } } },
    { new: true }
  ).then(
    User.updateOne(
      { _id: userId },
      { $set: { "cart.totalPrice": newTotalPrice } }
    ).then(() => {
      res.json({ remove: true, totalPrice: newTotalPrice });
    })
  );
};

const qtyChange = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
   
    const useer = await User.findById(req.session.user._id);
    
const key = req.query.expressionKey
const quantity = req.query.currentQuantity

    useer.changeQuantity(
      product,
      key,
      quantity,
      (response) => {
        res.json(response);
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};


const loadProductDetail = async(req, res )  =>{
  
  try {
    const user = await User.findById(req.session.user._id)
    const product = await Product.findById(req.query.id)
  res.render('productdetail', {product:product, user:user})
  } catch (e) {
    console.log(`product detail load page: ${e.message}`);
  }
  
}
const loadCheckout = async(req, res )  =>{
  
  try {
    const address = await Address.find({user: req.session.user._id})
    console.log(address);
    const user = await User.findById(req.session.user._id).populate("cart.items.product")
    const product = await Product.findById(req.query.id)
  res.render('checkout', {product, user, address})
  } catch (e) {
    console.log(`product detail load page: ${e.message}`);
  }
  
}

const addAddress = async(req, res )  =>{
  
  try {
    const reqaddress = req.body
    const adrsData =  Address({
      address:[reqaddress],
      user: req.session.user._id
    })

    const result = await adrsData.save()
if (result) {
  res.redirect('/checkout')
} else {
  res.send("something wrong while addin address")
}


  
  } catch (e) {
    console.log(`product detail load page: ${e.message}`);
  }
  
}




module.exports = {
  loadRegister,
  addUser,
  loadLogin,
  loginValidate,
  loadHome,
  logOut,
  loadProductList,
  addToCart,
  loadCartManage,
  removeCartItem,
  qtyChange,
  loadProductDetail,
  loadCheckout,
  addAddress,
};
// const deleteCartItem = async (req, res) => {
//   const product = await Product.findById(req.query.id)
//   const itemId = user.cart.items.findIndex(items => { items.product == product._id })
//   const itId = itemId._id

//   const userId = req.session.user._id
//   const result = await User.findOneAndUpdate({ _id: userId }, { $pull: { cart: { items: { _id: itId } } } })
//   res.redirect('/cartmanage')
// }
// const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env
// const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
//   lazyLoading: true
// })

// const sendOTP = async (req, res, next) => {
//   const phoneNumber = req.body.mobile
//   // const countryCode = +91;

//   try {
//     const otpResponse = await client.verify
//       .services(TWILIO_SERVICE_SID)
//       .verifications.create({
//         to: `+91${phoneNumber}`,
//         channel: 'sms'
//       })
//     res.status(200).send(`OTP send succesdfully: ${JSON.stringify(otpResponse)}`)
//   } catch (error) {
//     res.status(error?.status || 400).send(error?.message || 'something went wrong')
//   }
// }

// const verifyOTP = async (req, res, next) => {
//   const { phoneNumber, otp } = req.body
//   try {
//     const verifiedResponse = await client.verify
//       .services(TWILIO_SERVICE_SID)
//       .verificationChecks.create({
//         to: `+91${phoneNumber}`,
//         code: otp
//       })
//     res.status(200).send(`OTP verified succesfully: ${JSON.stringify(verifiedResponse)}`)
//   } catch (error) {
//     res.status(error?.status || 400).send(error?.message || 'something went wrong')
//   }
// }
