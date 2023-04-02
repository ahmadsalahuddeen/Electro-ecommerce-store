const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Product = require("../models/poductModel");
const Order = require("../models/order");
const helper = require("../helpers/userHelper");
const Banner = require("../models/banner");
const Coupon = require("../models/coupon");
const path = require("path");
const { findOne } = require("../models/banner");

const loadAdminLogin = async (req, res, next) => {
  try {
    res.render("adminlogin");
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};
const loginValidate = async (req, res, next) => {
  try {
    const { email } = req.body;
    const passoword = req.body.password;
    const adminEmail = process.env.ADMINEMAIL;
    const sadmimPassword = process.env.ADMINPASSWORD;
    // console.log(`${passoword}  ${sadmimPassword}`);
    if (email === adminEmail) {
      if (passoword === sadmimPassword) {
        req.session.admin = req.body.email;
        res.redirect("/admin/home");
      } else {
        res.render("adminlogin", { message: "hi passoword" });
      }
    } else {
      res.render("adminlogin", { message: "hi something woring" });
    }
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};
const loadCategory = async (req, res, next) => {
  try {
    const category = await Category.find({});
    res.render("categorymanage", { category });
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const loadAddCategory = async (req, res, next) => {
  try {
    res.render("addcategory");
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const loadEditcategory = async (req, res, next) => {
  try {
    const { id } = req.query;

    const categoryData = await Category.findById({ _id: id });
    res.render("editcategory", { category: categoryData });
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};
const loadProductManage = async (req, res, next) => {
  try {
    const product = await Product.find().populate('category');
    res.render("productmanage", { product });
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const loadAddProductPage = async (req, res, next) => {
  try {
    const category = await Category.find();
    const product = await Product.find().populate('category');
    res.render("addproduct", { product, category });
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const loadEditProductPage = async (req, res, next) => {
  try {
    const id = req.query.id;
    const category = await Category.find();
    const product = await Product.findById({ _id: id }).populate('category');
    console.log(product.name);

    res.render("editproduct", { product, category });
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const loadUserManagement = async (req, res, next) => {
  try {
    const userData = await User.find({});
    res.render("user-manage", { user: userData });
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const loadHome = async (req, res, next) => {
  try {
    res.render("adminhome");
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const adminLogout = async (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    console.log(req.query.id);

    let orderData = await Order.findById(req.query.id).populate("items.product");
    console.log(orderData);

    res.render("invoice", { orderData });
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await User.findByIdAndUpdate(id, { access: false });
    res.redirect("/admin/usermanage");
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const unBlockUser = async (req, res, next) => {
  try {
    const { id } = req.paramsff;

    await User.findByIdAndUpdate(id, { access: true });
    res.redirect("/admin/usermanage");
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const AddCategory = async (req, res, next) => {
  try {
    const categoryName = req.body.name;
    const category = new Category({
      name: categoryName,
    });
    const catData = await category.save();
    if (catData) {
      res.redirect("/admin/categorymanage");
    } else {
      res.render("category", { message: "something wrong" });
    }
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const editCategory = async (req, res, next) => {
  try {
    const oldName = req.body.oldName;
    const newName = req.body.newName;

    const editCat = await Category.findOneAndUpdate(
      { name: oldName },
      { name: newName }
    );
    if (editCat) {
      res.redirect("/admin/categorymanage");
    } else {
      res.render("editcategory", { message: "something wrong" });
    }
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = req.query.id;

    const dltStatus = await Category.findByIdAndDelete(id);
    if (dltStatus) {
      res.redirect("/admin/categorymanage");
    } else {
      console.log("delete failed");
    }
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const image = req.files.images;
    console.log(image);
    const img = [];
    image.forEach((element, i) => {
      img.push(element.path.substring(6));
    });

    const product = new Product({
      name: req.body.name,
      brand: req.body.brand,
      description: req.body.description,
      image: img,
      category: req.body.category,
      price: req.body.price,
      discount: req.body.discount,
      stock: req.body.stock,
    });
    const productData = await product.save();
    if (productData) {
      res.redirect("/admin/productmanage");
    } else {
      res.render("addproduct", { message: "something wrongg wrong" });
    }
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const id = req.query.id;
    const result = await Product.findByIdAndDelete(id);
    if (result) {
      res.redirect("/admin/productmanage");
    } else {
      console.log("something gone wrong while deleting");
    }
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const editProduct = async (req, res, next) => {
  try {
    const id = req.body.id;
    const { name, brand, description, price, discount, stock, category } =
      req.body;

    if (req.files.images) {
      const image = req.files.images;
      const img = [];
      image.forEach((element, i) => {
        img.push(element.path.substring(6));
      });
      const result = await Product.findByIdAndUpdate(id, {
        name,
        brand,
        description,
        price,
        discount,
        stock,
        image: img,
        category,
      });
      if (result) {
        res.redirect("/admin/productmanage");
      } else {
        res.send("somwthing went wrong");
      }
    } else {
      const result = await Product.findByIdAndUpdate(id, {
        name,
        brand,
        description,
        price,
        discount,
        stock,
        category,
      });
      if (result) {
        res.redirect("/admin/productmanage");
      } else {
        res.send("something went wrong");
      }
    }
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const loadOrderManagePage = async (req, res, next) => {
  try {
    const orderData = await Order.find().populate("items.product");
    res.render("adminOrderManage", { orderData });
  } catch (error) {
    console.log(error.message);
  }
};

const changeOrderStatus = async (req, res, next) => {
  try {
    const orderData = await Order.findByIdAndUpdate(req.query.id, {
      $set: { orderStat: req.query.status },
    });
    console.log(orderData);

    res.redirect("/admin/orderManage");
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};
const cancelOrder = async (req, res, next) => {
  try {
    const orderData = await Order.findByIdAndUpdate(req.query.id, {
      $set: { orderStat: req.query.status },
    });
    console.log(orderData);
    redirect("/admin/orderManage");
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};

const loadDashboard = async (req, res, next) => {
  try {
    helper.dashboard(req, res);
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};
const laodBannerManage = async (req, res, next) => {
  try {
    let bannerData = await Banner.find({});
    res.render("bannermanage", { bannerData });
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};
const laodCouponManage = async (req, res, next) => {
  try {
    let couponData = await Coupon.find({});
    res.render("couponmanage", { couponData });
  } catch (error) {
    console.log(error.message);
    error.admin = true
            next(error)
  }
};

const loadaddCoupon = async (req, res, next) => {
  try {
    res.render("addcoupon");
  } catch (error) {  console.log(error.message);
    error.admin = true
            next(error)}
};
const loadEditCoupon = async (req, res, next) => {
  try {
    let id = req.query.id;
    let couponData = await Coupon.findById(id);

    res.render("editcoupon", { couponData });
  } catch (error) {  console.log(error.message);
    error.admin = true
            next(error)}
};
const addCoupon = async (req, res, next) => {
  try {
    let newCoupon = new Coupon({
      name: req.body.name,
      description: req.body.description,
      minCartAmount: req.body.minCartAmount,
      discountAmount: req.body.discountAmount,
      expiryDate: req.body.expiryDate,
      startDate: req.body.startDate,
      stock: req.body.stock,
    });
    let result = await newCoupon.save();
    if (result) {
      res.redirect("/admin/couponManage");
    } else {
      res.send("something went wrong while adding");
    }
  } catch (error) {


    console.log(error.message);
    error.admin = true
            next(error)
  }
};

const editCoupon = async (req, res, next) => {
  try {
    const editCat = await Coupon.findByIdAndUpdate(req.body.id, {
      $set: {
        name: req.body.name,
        description: req.body.description,
        minCartAmount: req.body.minCartAmount,
        discountAmount: req.body.discountAmount,
        expiryDate: req.body.expiryDate,
        startDate: req.body.startDate,
        stock: req.body.stock,
        status: req.body.status,
      },
    }).then((doc) => {
      console.log(doc);
      if (doc) {
        res.redirect("/admin/couponManage");
      } else {
        res.render("editcoupon", { message: "something wrong" });
      }
    });
  } catch (error) {
    console.log(error.message);
    error.admin = true
            next(error)
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const id = req.query.id;
  
    await Coupon.findByIdAndDelete(id).then((doc) => {
      if (doc) {
        res.redirect("/admin/couponManage");
      } else {
        console.log("delete failed");
      }
    });
    
  } catch (error) {
    console.log(error.message);
    error.admin = true
            next(error)
  }
};

const loadBannerManage = async (req, res, next) => {
  try {
    
    let bannerData = await Banner.find({});
    res.render("bannerManage", { bannerData });
  } catch (error) {
    console.log(error.message);
    error.admin = true
            next(error)
  }
};

const addBanner = async (req, res, next) => {
  try {
    
    const sharp = require("sharp");
    let ima = req.files.bannerImage[0].path.substring(6);
    let result = await Banner.create({
      title: req.body.title,
      description: req.body.description,
      image: ima,
    });
    if (result) {
      console.log(result);
      res.redirect("/admin/bannerManage");
    } else {
      console.log("something went wrong didn't add banner");
      res.redirect("/admin/bannerManage");
    }
  } catch (error) {
    console.log(error.message);
    error.admin = true
            next(error)
  }
};

const loadAddBanner = async (req, res, next) => {
  try {
    
    res.render("addBanner");
  } catch (error) {
    console.log(error.message);
    error.admin = true
            next(error)
  }
};
const deleteBanner = async (req, res, next) => {
  try {
    await Banner.findByIdAndDelete(req.query.id);
    res.redirect("/admin/bannerManage");
  } catch (error) {
    console.log(error.message);
    error.admin = true
            next(error)
  }
};

const loadDailySales = async (req, res, next) => {
  try {
    helper.dailyReport(req, res);
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};
const loadWeeklySales = async (req, res, next) => {
  try {
    helper.weeklyReport(req, res);
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};
const loadYearlySales = async (req, res, next) => {
  try {
    helper.yearlyReport(req, res);
  } catch (error) {
    console.log(error.message);
    error.admin = true;
    next(error);
  }
};
module.exports = {
  loadYearlySales,
  loadWeeklySales,
  loadDailySales,
  deleteBanner,
  loadAddBanner,
  addBanner,
  loadBannerManage,
  deleteCoupon,
  editCoupon,
  loadEditCoupon,
  loadaddCoupon,
  addCoupon,
  laodCouponManage,
  laodBannerManage,
  loadDashboard,
  cancelOrder,
  changeOrderStatus,
  loadAdminLogin,
  loadOrderManagePage,
  loginValidate,
  loadUserManagement,
  loadHome,
  adminLogout,
  blockUser,
  unBlockUser,
  loadCategory,
  loadAddCategory,
  AddCategory,
  loadEditcategory,
  editCategory,
  deleteCategory,
  loadProductManage,
  loadAddProductPage,
  loadEditProductPage,
  deleteProduct,
  addProduct,
  editProduct,
  getInvoice,
};
