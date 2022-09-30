const express = require('express')

const {addNotification, getNotification} = require('../controllers/notificationsController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

//middleware user authentication
router.use(requireAuth)

// add notification route
router.post('/add', addNotification)

// get notification by id route
router.get('/:id', getNotification)


module.exports = router

