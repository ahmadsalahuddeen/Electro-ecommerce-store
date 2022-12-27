const { RecordingRulesInstance } = require("twilio/lib/rest/video/v1/room/roomRecordingRule");

const isLogin = async(req, res, next)=>{
   
        
if (req.session.user) {
    
} else {
   return res.redirect('/admin')
}

next();
  
}


const isLogout = async(req, res, next )  =>{
   
        if (req.session.user) {
         return   res.redirect('/admin/home')
            
        }
        next();
   
}


module.exports = {
isLogin,
isLogout
}