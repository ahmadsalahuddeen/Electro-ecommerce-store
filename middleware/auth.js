const isLogin = async(req, res, next )=>{
    try {
        console.log(req.session.user);
        if (req.session.user) {
           
        } else{
           return  res.redirect('/login')
        }
        next();
        


    } catch (error) {
        console.log(error.message)
    }
}




const isLogout = async(req, res, next )=>{
    try {
        console.log('islogout');
        console.log(req.session.user);
if (req.session.user) {
    
    return res.render('home')
}
next();

        
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    isLogin,
    isLogout
}