const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Product = require("../models/poductModel");
const { response, render } = require("../routes/userRoute");
const { findById, find } = require("../models/userModel");
const Address = require('../models/address');
const Order = require('../models/order')

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
     
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.access) {
          req.session.isLoggedIn = true;
          req.session.user = userData;
          req.session.cartLength = userData.cart.items.length
          req.session.cartTotalPrice = userData.cart.totalPrice

   
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
  res.render("productlist", { product, user 
  });
};

const addToCart = async (req, res) => {
  const useer = await User.findById(req.session.user._id);

  const productId = req.query.id;

  Product.findById(req.body.productid)
    .then((product) => {
      useer.addToCart(product, (response) => {
        
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
    
  }
  
}
const loadCheckout = async(req, res )  =>{
  
  try {
    const address = await Address.find({user: req.session.user._id})

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
      add:[reqaddress],
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

const addAddressProfile = async(req, res )  =>{
  
  try {
    const reqaddress = req.body
    const adrsData =  Address({
      add:[reqaddress],
      user: req.session.user._id
    })

    const result = await adrsData.save()
if (result) {
  res.redirect('/userAddress')
} else {
  res.send("something wrong while addin address")
}


  
  } catch (e) {
    console.log(`product detail load page: ${e.message}`);
  }
  
}


const newOrder = async(req, res) =>{
  try {
     
    const userId = req.session.user._id
    const user = await User.findById(userId)








    const newOrderData = Order({
user: userId,
items: user.cart.items,
totalPrice: user.cart.totalPrice,
orderStat: "placed",
address: req.body.address._id,
paymentMethod: req.body.paymentMethod
})
const orderAdded = await newOrderData.save()

if (orderAdded) {
  user.cart.items.forEach(async(eachItems)=>{
    const proId = eachItems.product._id
    await Product.findByIdAndUpdate(proId, { $inc: {stock: -eachItems.qty}})
   
    
  })
} else {
  console.log("order add failed succefully");
}
user.cart.items =[]
user.cart.totalPrice = null
await user.save()

res.redirect('/ordersuccess')

  } catch (e) {
    console.log(e.message);
  }


}

const loadOrderSuccess = async(req, res)  =>{
  try {
    res.render('ordersuccess')


  } catch (e) {
    console.log(e);
  }
}
const loadUserProfile = async(req, res)  =>{
  try {

    const useer = await User.findOne({_id: req.session.user._id})
    console.log(useer);
    res.render('userprofile',  {user: useer})


  } catch (e) {
    console.log(e);
  }
}
const updateProfile = async(req, res)  =>{
  try {

   await User.findByIdAndUpdate(req.session.user._id, {name: req.body.name, mobile: req.body.mobile}).then(
    res.redirect('/userProfile')
   )

  } catch (e) {
    console.log(e);
  }
}
const loaduserAddress = async(req, res)  =>{
  try {
const useer = await User.findById(req.session.user._id)
    Address.find({user: req.session.user._id}).then((data)=>{
          
          res.render('userAddress',{adrsdata: data, user:useer })
   })
  } catch (e) {
    console.log(e);
  }
}
const laoduserOrderManage = async(req, res)  =>{
  try {
    const useer = await User.findById(req.session.user._id)
 const orderData = await Order.find({user: req.session.user._id}).populate("items.product")

 console.log(orderData);
  res.render('userOrderManage',{orderData: orderData, user:useer})

    
  } catch (e) {
    console.log(e);
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
  newOrder,
  loadOrderSuccess,
  loadUserProfile,
  updateProfile,
  loaduserAddress,
  addAddressProfile,
  laoduserOrderManage,
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
