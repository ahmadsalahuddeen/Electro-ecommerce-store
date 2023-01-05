const express = require('express')
const adminRoute = express()

const adminController = require('../controllers/adminController')
const auth = require('../middleware/adminAuth')

adminRoute.get('/', auth.isLogout, adminController.loadAdminLogin)
adminRoute.post('/', adminController.loginValidate)
adminRoute.get('/home', adminController.loadHome)
adminRoute.get('/usermanage', adminController.loadUserManagement)
adminRoute.get('/logout', auth.isLogout, adminController.adminLogout)
adminRoute.get('/blockuser/:id', adminController.blockUser)
adminRoute.get('/unblockuser/:id', adminController.unBlockUser)
adminRoute.get('/categorymanage', adminController.loadCategory)
adminRoute.get('/addcategory', adminController.loadAddCategory)
adminRoute.post('/addcategory', adminController.AddCategory)
adminRoute.get('/editcategory', adminController.loadEditcategory)
adminRoute.post('/editcategory', adminController.editCategory)
adminRoute.get('/deletecategory', adminController.deleteCategory)
adminRoute.get('/productmanage', adminController.loadProductManage)
adminRoute.get('/addproduct', adminController.loadAddProductPage)
adminRoute.post('/addproduct', adminController.addProduct)
adminRoute.get('/editproduct', adminController.loadEditProductPage)
adminRoute.get('/deleteproduct', adminController.deleteProduct)
adminRoute.post('/editproduct', adminController.editProduct)

adminRoute.get('*', function (req, res) {
  res.redirect('/admin')
})

module.exports = adminRoute
