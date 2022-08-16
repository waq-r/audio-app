const express = require('express')

const {addNotification, getAllNotifications, getNotification} = require('../controllers/notificationsController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

//middleware user authentication
router.use(requireAuth)

// add notification route
router.post('/add', addNotification)

// show notification route
router.post('/', getAllNotifications)

// get notification by id route
router.get('/:id', getNotification)


module.exports = router

