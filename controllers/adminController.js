const User = require("../models/userModel");
const { render } = require("../routes/userRoute");

const loadAdminLogin = async(req, res)=>{
    res.render('adminlogin');
}
const loginValidate = async(req, res)=>{
    const email = req.body.email;
    const passoword = req.body.password;
    const adminEmail  = process.env.ADMINEMAIL;
    const sadmimPassword = process.env.ADMINPASSWORD;
    // console.log(`${passoword}  ${sadmimPassword}`);
if(email == adminEmail ){
    if (passoword == sadmimPassword ) {
        req.session.user = req.body.email
        res.redirect('/admin/adminhome')
        
    } else {
        res.render('adminlogin', {message: "hi passoword"})
    }
}else{
    res.render('adminlogin', {message: "hi something woring"})
}

}


const loadUserManagement = async (req, res) =>{
    try {
  const userData = await User.find({});
        res.render('user-manage', {user: userData})
    } catch (error) {
     console.log(error.message);   
    }
    
}


const loadHome = async (req, res) =>{
    try {
        res.render('adminhome')
    } catch (error) {
     console.log(error.message);   
    }
    
}

const adminLogout = async(req, res)=>{
    req.session.destroy();
    res.redirect('/admin')
}

const blockUser = async(req,res)=>{
    const id = req.params.id;

    await User.findByIdAndUpdate(id,{access: false})
    res.redirect('/admin/usermanage')
}
const unBlockUser = async(req,res)=>{
    const id = req.params.id;

    await User.findByIdAndUpdate(id,{access: true})
    res.redirect('/admin/usermanage')
    
     
}




module.exports = {
    loadAdminLogin,
    loginValidate,
    loadUserManagement,
    loadHome,
    adminLogout,
    blockUser,
    unBlockUser,
}