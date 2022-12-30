const express = require('express')
const adminRoute = express()
const multer = require('multer');

const adminController = require('../controllers/adminController')
const auth = require('../middleware/adminAuth')
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname, '../public/userImages'))
  },
  filename: function (req, file, cb) {
    const name = Date.now() + ' ' + file.originalname
    cb(null, name)
  }
})

const upload = multer({ storage })
adminRoute.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Expires', '-1')
  res.header('Pragma', 'no-cache')
  next()
})
adminRoute.get('/', auth.isLogout, adminController.loadAdminLogin)
adminRoute.post('/', adminController.loginValidate)
adminRoute.get('/home', adminController.loadHome)
adminRoute.get('/usermanage', adminController.loadUserManagement)
adminRoute.get('/logout', auth.isLogin, adminController.adminLogout)
adminRoute.get('/blockuser/:id', adminController.blockUser)
adminRoute.get('/unblockuser/:id', adminController.unBlockUser)
adminRoute.get('/categorymanage', adminController.loadCategory)
adminRoute.get('/addcategory', adminController.loadAddCategory)
adminRoute.post('/addcategory', adminController.AddCategory)
adminRoute.get('/editcategory', adminController.loadEditcategory)
adminRoute.post('/editcategory', adminController.editCategory)
adminRoute.get('/deletecategory', adminController.deleteCategory)
adminRoute.get('/productmanage', adminController.loadProductManage)
adminRoute.get('/addproduct', upload.array('image' , 3) , adminController.loadAddProductPage)
adminRoute.get('/editproduct', adminController.loadEditProductPage)
adminRoute.get('*', function (req, res) {
  res.redirect('/admin')
})

module.exports = adminRoute
