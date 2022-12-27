const loadAdminLogin = async(req, res)=>{
    res.render('adminlogin');
}
const loginValidate = async(req, res)=>{
    const email = req.body.email;
    const passoword = req.body.passoword;
    const adminEmail  = process.env.ADMINEMAIL;
    const admimPassword = process.env.ADMINPASSWORD;
if(email == adminEmail && passoword == admimPassword ){
res.render('')
}else{
    res.render('adminlogin', {message: "Invalid Email"})
}

}




module.exports = {
    loadAdminLogin,
}