const express = require('express')

const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv').config({ path: './config/.env' })
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')

const session = require('express-session')
app.use(session({
  secret: 'heyboi',
  cookie: {
    maxAge: 6000000
  }

}))

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set(express.static('public'))

// ---------------------------------------------
const PORT = process.env.PORT || 4000

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log('Database connection failed')
  } else {
    console.log('DB connected succefully')
  }
})

app.set(express.static(path.join(__dirname, '/public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static('public'))
// app.use('/twilio-sms', twilioRouter)
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')

app.use('/', userRoute)
app.use('/admin', adminRoute)

app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT}/admin/productmanage`)
})
