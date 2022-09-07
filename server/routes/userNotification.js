const express = require('express')

const requireAuth = require('../middleware/requireAuth')

// controller functions
const {getAllUserNotifications,
        addUserNotification,
        markNotificationAsRead,
        countUnreadNotifications,
        getUserNotificationStats,
        getNotificationDetails
    } = require('../controllers/userNotificationController')

const router = express.Router()

//middleware user authentication
router.use(requireAuth)

// get all notifications for a user
router.get('/:id', getAllUserNotifications)

// get a notifications by Id
router.get('/details/:id', getNotificationDetails)

//save notification
router.post('/', addUserNotification)

//update notification
router.put('/:id', markNotificationAsRead)

// count user's unread notifications route
router.get('/count/:id', countUnreadNotifications)

// get user notifications with populated video documents
router.get('/stats/:id', getUserNotificationStats )

module.exports = router