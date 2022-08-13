const express = require('express')

// controller functions
const { loginUser, signupUser, incrementUserNotfications } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// audio list route
router.post('/audios', loginUser)

// user notification count route
router.get('/notifications/add/:role', incrementUserNotfications)


module.exports = router