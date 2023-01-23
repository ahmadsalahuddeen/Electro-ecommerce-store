const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Product = require('../models/poductModel')
const Order = require('../models/order')
const helper = require('../helpers/userHelper')

const loadAdminLogin = async (req, res) => {
  res.render('adminlogin')
}
const loginValidate = async (req, res) => {
  const { email } = req.body
  const passoword = req.body.password
  const adminEmail = process.env.ADMINEMAIL
  const sadmimPassword = process.env.ADMINPASSWORD
  // console.log(`${passoword}  ${sadmimPassword}`);
  if (email === adminEmail) {
    if (passoword === sadmimPassword) {
      req.session.admin = req.body.email
      res.redirect('/admin/adminhome')
    } else {
      res.render('adminlogin', { message: 'hi passoword' })
    }
  } else {
    res.render('adminlogin', { message: 'hi something woring' })
  }
}
const loadCategory = async (req, res) => {
  const category = await Category.find({})
  res.render('categorymanage', { category })
}

const loadAddCategory = async (req, res) => {
  res.render('addcategory')
}

const loadEditcategory = async (req, res) => {
  try {
    const { id } = req.query

    const categoryData = await Category.findById({ _id: id })
    res.render('editcategory', { category: categoryData })
  } catch (e) {
    console.log(e.message)
  }
}
const loadProductManage = async (req, res) => {
  const product = await Product.find({})
  res.render('productmanage', { product })
}

const loadAddProductPage = async (req, res) => {
  const category = await Category.find()
  const product = await Product.find()
  res.render('addproduct', { product, category })
}

const loadEditProductPage = async (req, res) => {
  const id = req.query.id
  const category = await Category.find()
  const product = await Product.findById({ _id: id })
  console.log(product.name)

  res.render('editproduct', { product, category })
}

const loadUserManagement = async (req, res) => {
  try {
    const userData = await User.find({})
    res.render('user-manage', { user: userData })
  } catch (error) {
    console.log(error.message)
  }
}

const loadHome = async (req, res) => {
  try {
    res.render('adminhome')
  } catch (error) {
    console.log(error.message)
  }
}

const adminLogout = async (req, res) => {
  req.session.destroy()
  res.redirect('/admin')
}

const blockUser = async (req, res) => {
  const { id } = req.params

  await User.findByIdAndUpdate(id, { access: false })
  res.redirect('/admin/usermanage')
}
const unBlockUser = async (req, res) => {
  const { id } = req.params

  await User.findByIdAndUpdate(id, { access: true })
  res.redirect('/admin/usermanage')
}

const AddCategory = async (req, res) => {
  const categoryName = req.body.name
  const category = new Category({
    name: categoryName
  })
  const catData = await category.save()
  if (catData) {
    res.redirect('/admin/categorymanage')
  } else {
    res.render('category', { message: 'something wrong' })
  }
}

const editCategory = async (req, res) => {
  try {
    const oldName = req.body.oldName
    const newName = req.body.newName

    const editCat = await Category.findOneAndUpdate(
      { name: oldName },
      { name: newName }
    )
    if (editCat) {
      res.redirect('/admin/categorymanage')
    } else {
      res.render('editcategory', { message: 'something wrong' })
    }
  } catch (e) {
    console.log(e.message)
  }
}

const deleteCategory = async (req, res) => {
  const id = req.query.id

  const dltStatus = await Category.findByIdAndDelete(id)
  if (dltStatus) {
    res.redirect('/admin/categorymanage')
  } else { 
    console.log('delete failed')
  }
}

const addProduct = async (req, res) => {
  try {
    const image = req.files.images
    console.log(image)
    const img = []
    image.forEach((element, i) => {
      img.push(element.path.substring(6))
    })

    const product = new Product({
      name: req.body.name,
      brand: req.body.brand,
      description: req.body.description,
      image: img,
      category: req.body.category,
      price: req.body.price,
      discount: req.body.discount,
      stock: req.body.stock
    })
    const productData = await product.save()
    if (productData) {
      res.redirect('/admin/productmanage')
    } else {
      res.render('addproduct', { message: 'something wrong wrong' })
    }
  } catch (error) {
    console.log(error.message)
  }
}
const deleteProduct = async (req, res) => {
  const id = req.query.id
  const result = await Product.findByIdAndDelete(id)
  if (result) {
    res.redirect('/admin/productmanage')
  } else {
    console.log('something gone wrong while deleting')
  }
}

const editProduct = async (req, res) => {
  const id = req.body.id
  const { name, brand, description, price, discount, stock, category } =
    req.body

  if (req.files.images) {
    const image = req.files.images
    const img = []
    image.forEach((element, i) => {
      img.push(element.path.substring(6))
    })
    const result = await Product.findByIdAndUpdate(id, {
      name,
      brand,
      description,
      price,
      discount,
      stock,
      image: img,
      category
    })
    if (result) {
      res.redirect('/admin/productmanage')
    } else {
      res.send('somwthing went wrong')
    }
  } else {
    const result = await Product.findByIdAndUpdate(id, {
      name,
      brand,
      description,
      price,
      discount,
      stock,
      category
    })
    if (result) {
      res.redirect('/admin/productmanage')
    } else {
      res.send('something went wrong')
    }
  }
}


const loadOrderManagePage = async(req, res ) =>{
  try {
const orderData =  await Order.find().populate('items.product')
res.render('adminOrderManage', {orderData} )

  } catch (error) {
    console.log(error.message);
  }
}

const changeOrderStatus = async(req, res ) =>{
  try {
const orderData =  await Order.findByIdAndUpdate( req.query.id, {$set: {orderStat: req.query.status}})
console.log(orderData);

res.redirect('/admin/orderManage')

  } catch (error) {
    console.log(error.message);
  }
}
const cancelOrder = async(req, res ) =>{
  try {
const orderData =  await Order.findByIdAndUpdate( req.query.id, {$set: {orderStat: req.query.status}})
console.log(orderData);
redirect('/admin/orderManage')



  } catch (error) {
    console.log(error.message);
  }
}


module.exports = {
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
  editProduct
}
