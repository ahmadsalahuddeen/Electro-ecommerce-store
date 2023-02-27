const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Product = require("../models/poductModel");
const { response, render } = require("../routes/userRoute");
const { findById, find, findOne } = require("../models/userModel");
const Address = require("../models/address");
const Order = require("../models/order");
const Wishlist = require("../models/wishlist");
const { findByIdAndUpdate } = require("../models/address");
const helper = require("../helpers/userHelper");
const Coupon = require("../models/coupon");
const { ObjectId } = require("mongodb");
const Banner = require("../models/banner");
const session = require("express-session");

const loadRegister = async (req, res, next) => {
  try {
    if (req.session.isLoggedIn === true) {
      res.redirect("/home");
    } else {
      res.render("userRegister");
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const secretPassword = async (password) => {
  try {
    const secretpassword = await bcrypt.hash(password, 10);
    return secretpassword;
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const loadLogin = async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn) {
      res.render("login");
    } else {
      res.redirect("/productlist");
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const addUser = async (req, res, next) => {
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
        req.session.cartLength = userData.cart.items.length;
        req.session.cartTotalPrice = userData.cart.totalPrice;
        res.redirect("/home");
      }
    } else {
      res.render("userRegister", { message: "Incorrect passoword" });
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const logOut = async (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const loginValidate = async (req, res, next) => {
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
          req.session.cartLength = userData.cart.items.length;
          req.session.cartTotalPrice = userData.cart.totalPrice;

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
    next(error);
  }
};

const loadHome = async (req, res, next) => {
  try {
    const productData = await Product.find();
    const userData = await User.findOne({ _id: req.session.user._id });
    const BannerData = await Banner.find({});
    console.log(userData);
    if (req.session.isLoggedIn) {
      res.render("home", {
        product: productData,
        user: userData,
        BannerData,
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const loadProductList = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user).populate(
      "cart.items.product"
    );

    const product = await Product.find();
    res.render("productlist", { product, user });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const useer = await User.findById(req.session.user._id);

    const productId = req.query.id;

    Product.findById(req.body.productid)
      .then((product) => {
        useer.addToCart(product, (response) => {
          res.json(response);
        });
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const loadCartManage = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user).populate(
      "cart.items.product"
    );
    res.render("cartmanage", { user });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
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
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const qtyChange = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);

    const useer = await User.findById(req.session.user._id);

    const key = req.query.expressionKey;
    const quantity = req.query.currentQuantity;

    useer.changeQuantity(product, key, quantity, (response) => {
      res.json(response);
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const loadProductDetail = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user._id);
    const product = await Product.findById(req.query.id);
    res.render("productdetail", { product: product, user: user });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
const loadCheckout = async (req, res, next) => {
  try {
    const address = await Address.find({ user: req.session.user._id });

    const user = await User.findById(req.session.user._id).populate(
      "cart.items.product"
    );
    const product = await Product.findById(req.query.id);
    res.render("checkout", { product, user, address });
  } catch (error) {
    console.log(`product detail load page: ${e.message}`);
    console.log(error.message);
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const reqaddress = req.body;
    const adrsData = Address({
      add: [reqaddress],
      user: req.session.user._id,
    });

    const result = await adrsData.save();
    if (result) {
      res.redirect("/checkout");
    } else {
      res.send("something wrong while addin address");
    }
  } catch (error) {
    console.log(`product detail load page: ${e.message}`);
    console.log(error.message);
    next(error);
  }
};

const addAddressProfile = async (req, res, next) => {
  try {
    const reqaddress = req.body;
    const adrsData = Address({
      add: [reqaddress],
      user: req.session.user._id,
    });

    const result = await adrsData.save();
    if (result) {
      res.redirect("/userAddress");
    } else {
      res.send("something wrong while addin address");
    }
  } catch (error) {
    console.log(`product detail load page: ${e.message}`);
    console.log(error.message);
    next(error);
  }
};

const newOrder = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);


    let finalTotalPrice = user.cart.totalPrice - req.body.couponAmount;

    if (req.body.paymentMethod === "cod") {
      const newOrderData = Order({
        user: userId,
        items: user.cart.items,

        totalPrice: finalTotalPrice,
        orderStat: "placed",
        address: req.body.address._id,
        paymentMethod: req.body.paymentMethod,
      });

      const orderAdded = await newOrderData.save();

      user.cart.items.forEach(async (eachItems) => {
        const proId = eachItems.product._id;
        await Product.findByIdAndUpdate(proId, {
          $inc: { stock: -eachItems.qty },
        });
      });

      user.cart.items = [];
      user.cart.totalPrice = null;
      await user.save();

      res.json({ codDelivery: true });
    } else {
      //online payment
      const newOrderData = Order({
        user: userId,
        items: user.cart.items,
        totalPrice: finalTotalPrice,
        orderStat: "Pending",
        address: req.body.address._id,
        paymentMethod: req.body.paymentMethod,
      });

      const orderAdded = await newOrderData.save().then((doc) => {
        const Razorpay = require("razorpay");
        var instance = new Razorpay({
          key_id: "rzp_test_9WGL800ffhbOhn",
          key_secret: "3R22EvoWAjxRxqwRxrTF168N",
        });

        instance.orders
          .create({
            amount: doc.totalPrice * 100,
            currency: "INR",
            receipt: "" + doc._id,
          })
          .then((response) => {
            res.json({
              orderData: doc,
              user: req.session.user,
              order: response,
            });
          });
      });
    }
    await Coupon.findOneAndUpdate(
      { name: req.body.couponRedeme },
      { $addToSet: { usedUsers: userId } }
    );
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const loadOrderSuccess = async (req, res, next) => {
  try {
    res.render("ordersuccess");
  } catch (error) {
    console.log(error);
    console.log(error.message);
    next(error);
  }
};
const loadUserProfile = async (req, res, next) => {
  try {
    const useer = await User.findOne({ _id: req.session.user._id });
    console.log(useer);
    res.render("userprofile", { user: useer });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.session.user._id, {
      name: req.body.name,
      mobile: req.body.mobile,
    }).then(res.redirect("/userProfile"));
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
const loaduserAddress = async (req, res, next) => {
  try {
    const useer = await User.findById(req.session.user._id);
    Address.find({ user: req.session.user._id }).then((data) => {
      res.render("userAddress", { adrsdata: data, user: useer });
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
const signout = async (req, res, next) => {
  try {
    req.user.session.destroy();
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
const laoduserOrderManage = async (req, res, next) => {
  try {
    const useer = await User.findById(req.session.user._id);
    const orderData = await Order.find({ user: req.session.user._id }).populate(
      "items.product"
    );

    res.render("userOrderManage", { orderData: orderData, user: useer });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
const loadwishlist = async (req, res, next) => {
  try {
    const useer = await User.findById(req.session.user._id);
    const wlData = await Wishlist.findOne({
      userId: req.session.user._id,
    }).populate("products");

    res.render("wishlist", { user: useer, wlData: wlData });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
const addToWishlist = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const proId = req.query.id;
    const wListData = await Wishlist.findOne({ userId });
    console.log(`wishlist Data
  ${wListData}`);

    if (wListData) {
      const isProductExist = wListData.products.findIndex(
        (el) => new String(el).trim() === new String(proId).trim()
      );
      console.log(`product exist: ${isProductExist}`);
      if (isProductExist === -1) {
        await Wishlist.updateOne(
          { userId: userId },
          { $push: { products: proId } }
        ).then((doc) => {
          console.log(`update Data:
        ${doc}`);

          const wListLength = doc.length;
          res.json({ count: wListLength, exists: false });
        });
      } else {
        res.json({ exists: true });
      }
    } else {
      const newItem = new Wishlist({
        userId,
        products: proId,
      });
      await newItem.save().then((doc) => {
        const wListLength = doc.length;
        res.json({ count: wListLength, exists: false });
      });
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
const deleteAddress = async (req, res, next) => {
  try {
    console.log(req.query.id);

    await Address.findOneAndDelete({ _id: req.query.id });
    res.redirect("/userAddress");
  } catch (error) {
    console.log(error.message);
    console.log(error.message);
    next(error);
  }
};

const editAddress = async (req, res, next) => {
  try {
    console.log(req.query.id);
    await Address.findByIdAndUpdate(req.query.id, {
      $set: {
        add: {
          name: req.body.name,
          mobile: req.body.mobile,
          pincode: req.body.pincode,
          district: req.body.district,
          state: req.body.state,
          fullAddress: req.body.fullAddress,
          landmark: req.body.landmark,
        },
      },
    });
    res.redirect("/userAddress");
  } catch (error) {
    console.log(error.message);
    console.log(error.message);
    next(error);
  }
};
const cancelOrder = async (req, res, next) => {
  try {
    console.log(req.query.id);
    const status = "Canceled";
    await helper.chnageOrderStatus(req.query.id, status);
    res.redirect("/userOrderManage");
  } catch (error) {
    console.log(error.message);
    console.log(error.message);
    next(error);
  }
};

const deleteWishlistItem = async (req, res, next) => {
  console.log(`product id in ${req.query.id}`);
  try {
    await Wishlist.findOneAndUpdate(
      { userId: req.session.user._id },
      { $pull: { products: req.query.id } }
    ).then((doc) => {
      const length = doc.products.length;
      res.json({ length: length });
    });
  } catch (error) {
    console.log("deleting wihslist error");
    console.log(error.message);
    next(error);
  }
};

const verifyPayement = async (req, res, next) => {
  try {
    let body =
      req.body.response.razorpay_order_id +
      "|" +
      req.body.response.razorpay_payment_id;

    var crypto = require("crypto");
    var expectedSignature = crypto
      .createHmac("sha256", "3R22EvoWAjxRxqwRxrTF168N")
      .update(body.toString())
      .digest("hex");
    console.log("sig received ", req.body.response.razorpay_signature);
    console.log("sig generated ", expectedSignature);
    var response = { signatureIsValid: "false" };

    if (expectedSignature === req.body.response.razorpay_signature) {
      response = { signatureIsValid: "true" };

      const userId = req.session.user._id;
      const user = await User.findById(userId);

      user.cart.items.forEach(async (eachItems) => {
        const proId = eachItems.product._id;
        await Product.findByIdAndUpdate(proId, {
          $inc: { stock: -eachItems.qty },
        });
      });

      user.cart.items = [];
      user.cart.totalPrice = null;
      await user.save();

      await Order.findOneAndUpdate(
        { _id: req.body.orderData._id },
        { $set: { orderStat: "Placed" } }
      );
    }
    res.json({ response: response });
  } catch (error) {
    console.log("deleting wihslist error");
    console.log(error.message);
    next(error);
  }
};

const loadOrderFailed = (req, res, next) => {
  try {
    res.render("orderFailed");
  } catch (error) {
    console.log(error.message);
    console.log(error.message);
    next(error);
  }
};
const checkCoupon = async (req, res, next) => {
  try {
    console.log("getting here");

    let couponData = await Coupon.findOne({ name: req.body.promo });
    console.log(couponData);
    if (couponData) {
      let currentDate = new Date()
      let expiryDate = couponData.expiryDate
      if (expiryDate > currentDate ) {
        if (req.body.cartAmount > couponData.minCartAmount) {
          let userId = req.session.user._id;
          console.log("getting here 111111");
          if (couponData.usedUsers.length <= 0) {
            console.log("getting here222222s");
            let couponAmount = couponData.discountAmount;
            let couponName = couponData.name;
            res.json({ couponAvailable: true, couponAmount, couponName });
          } else {
            let isClaimed = couponData.usedUsers.findIndex(
              (element) => element.toString() === userId
            );

            if (isClaimed === -1) {
              let couponAmount = couponData.discountAmount;
              res.json({ couponAvailable: true, couponAmount });
            } else {
              res.json({
                erro: true,
                errorMessage: "Promo Code is already Claimed",
              });
            }
          }
        } else {
          res.json({ erro: true, errorMessage: "Min Cart Amount" });
        }
      } else {
        res.json({ erro: true, errorMessage: "Coupon Expired" });
      }
    } else {
      res.json({ erro: true, errorMessage: "Enter a valid Promo Code" });
    }
  } catch (error) {
    console.log(error.message);
    console.log(error.message);
    next(error);
  }
};


module.exports = {
  checkCoupon,
  loadOrderFailed,
  verifyPayement,
  loadwishlist,
  cancelOrder,
  editAddress,
  deleteAddress,
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
  deleteWishlistItem,
  addToWishlist,
};
