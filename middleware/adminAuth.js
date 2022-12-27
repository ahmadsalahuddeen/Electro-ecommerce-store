

const isLogin = async(req, res, next)=>{
   try {
            
if (req.session.user) {
    
} else {
   return res.redirect('/admin')
}

next();
   } catch (error) {
    
   }

  
}


const isLogout = async(req, res, next )  =>{
   try {
    if (req.session.user) {
      return  res.redirect('/admin/home')
         
     }
     next();
   } catch (error) {
    
   }
       
   
}


module.exports = {
isLogin,
isLogout
}