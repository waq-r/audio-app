const express = require('express')

// controller functions
const {uploadFile, saveFile, getFile} = require('../controllers/fileController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// get file route
router.get('/:type/:media', getFile)

//middleware user authentication
router.use(requireAuth)

// upload route
router.post('/upload', uploadFile)

// save route
router.post('/save/:media', saveFile)


module.exports = router