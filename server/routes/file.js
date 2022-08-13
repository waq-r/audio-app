const express = require('express')

// controller functions
const {uploadFile, saveFile, getFile} = require('../controllers/fileController')

const router = express.Router()

// upload route
router.post('/upload', uploadFile)

// save route
router.post('/save/:media', saveFile)

// get file route
router.get('/:type/:media', getFile)

module.exports = router