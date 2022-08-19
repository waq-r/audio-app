const express = require('express')

const requireAuth = require('../middleware/requireAuth')

// controller functions
const {getAllUserNotifications, addUserNotification, markNotificationAsRead, countUnreadNotifications} = require('../controllers/userNotificationController')

const router = express.Router()

//middleware user authentication
router.use(requireAuth)

// get all notifications for a user
router.get('/:id', getAllUserNotifications)

//save notification
router.post('/', addUserNotification)

//update notification
router.put('/:id', markNotificationAsRead)

// count user's unread notifications route
router.get('/count/:id', countUnreadNotifications)

module.exports = router