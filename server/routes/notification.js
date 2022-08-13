const express = require('express')

const router = express.Router()

const {addNotification, getAllNotifications, getNotification} = require('../controllers/notificationsController')
// add notification route
router.post('/add', addNotification)

// show notification route
router.post('/', getAllNotifications)

// get notification by id route
router.get('/:id', getNotification)


module.exports = router

