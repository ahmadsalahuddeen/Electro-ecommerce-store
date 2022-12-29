const express = require('express')
const adminRoute = express()


const userController = require('../controllers/adminController')
const auth = require('../middleware/adminAuth')
adminRoute.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
next();
});
adminRoute.get('/', auth.isLogout, userController.loadAdminLogin)
adminRoute.post('/', userController.loginValidate)
adminRoute.get('/home', userController.loadHome)
adminRoute.get('/usermanage', userController.loadUserManagement)
adminRoute.get('/logout', auth.isLogin, userController.adminLogout)
adminRoute.get('/blockuser/:id', userController.blockUser)
adminRoute.get('/unblockuser/:id', userController.unBlockUser)
adminRoute.get('/categorymanage', userController.loadCategory)
adminRoute.get('/addcategory', userController.loadAddCategory)
adminRoute.post('/addcategory', userController.AddCategory)
adminRoute.get('/editcategory', userController.loadEditcategory)
adminRoute.post('/editcategory', userController.editCategory)

adminRoute.get('*', function (req, res) {
  res.redirect('/admin')
})

module.exports = adminRoute
