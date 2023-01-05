const isLogin = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.redirect('/admin')
    }

    next()
  } catch (error) {}
}

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      return res.redirect('/admin/home')
    }
    next()
  } catch (error) {}
}

const isUserLogin = async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.redirect('/login')
    }
    next()
  } catch (e) {
    console.log(e.message)
  }
}
const isUserLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      res.redirect('/home')
    }
    next()
  } catch (e) {
    console.log(e.message)
  }
}

module.exports = {
  isLogin,
  isLogout,
  isUserLogin,
  isUserLogout
}
