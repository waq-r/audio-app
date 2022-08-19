require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')


const userRoutes = require('./routes/user')
const fileRoutes = require('./routes/file')
const videoRoutes = require('./routes/video')
const audioRoutes = require('./routes/audio')
const notificationRoutes = require('./routes/notification')
const userNotificationRoutes = require('./routes/userNotification')

// express app
const app = express()

// middleware
app.use(express.json())
app.use(fileUpload());


app.use((req, res, next) => {
  //console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/audio', audioRoutes)
app.use('/api/file', fileRoutes)
app.use('/api/user', userRoutes)
app.use('/api/notification', notificationRoutes)
app.use('/api/video', videoRoutes)
app.use('/api/usernotification', userNotificationRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI).then(() => {
// listen for requests
app.listen(process.env.PORT, () => {
    console.log('Connected to db, listening to port ', process.env.PORT)
})
}).catch((err) => {
    console.log(err)
})