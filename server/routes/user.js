const express = require('express')

// controller functions
const { 
        loginUser,
        signupUser,
        incrementUserNotfications,
        resetUserNotification,
        getUserNotification,
        getAllUsers,
        setUserStatus,
        getUserById
        } = require('../controllers/userController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()


// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

//middleware user authentication
router.use(requireAuth)

// audio list route
router.post('/audios', loginUser)

// user notification count route
router.get('/notifications/add/:role', incrementUserNotfications)

// user notification reset route
router.get('/notifications/reset/:id', resetUserNotification)

// get number of notifications of a user
router.get('/notifications/:id', getUserNotification)

//get all users
router.post('/', getAllUsers)

//get a user by id
router.get('/:id', getUserById)

//set user's status
router.post('/status', setUserStatus)

module.exports = router