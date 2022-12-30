const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Product = require('../models/poductModel')

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
      req.session.user = req.body.email
      res.redirect('/admin/adminhome')
    } else {
      res.render('adminlogin', { message: 'hi passoword' })
    }
  } else {
    res.render('adminlogin', { message: 'hi something woring' })
  }
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

const loadCategory = async (req, res) => {
  const category = await Category.find({})
  res.render('categorymanage', { category })
}

const loadAddCategory = async (req, res) => {
  res.render('addcategory')
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

const loadEditcategory = async (req, res) => {
  try {
    const { id } = req.query

    const categoryData = await Category.findById({ _id: id })
    res.render('editcategory', { category: categoryData })
  } catch (e) {
    console.log(e.message)
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
const loadProductManage = async (req, res) => {

  const product = await Product.find({})
  res.render('productmanage', { product: product })
}

const loadAddProductPage = async(req, res)=>{
  const product = await Product.find()
res.render('addproduct' , {product:product})
}

const loadEditProductPage = async(req,res) =>{
  const product = await Product.find()
  res.render('editproduct', {product:product})
}
module.exports = {
  loadAdminLogin,
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
}
