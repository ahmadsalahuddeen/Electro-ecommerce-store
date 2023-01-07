const ajaxVerify = (req, res, next) => {
if (req.session.isLoggedIn) {
    next()
} else {
    res.json({access : false})
}
}
module.exports = ajaxVerify;
