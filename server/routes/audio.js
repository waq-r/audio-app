const express = require('express')

// controller functions
const { getAudio, getAllAudios, saveAudio, deleteAudio } = require('../controllers/audioController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

//auth middleware
router.use(requireAuth)

// get an audio route
router.get('/:id', getAudio)

// get all audios route
router.get('/', getAllAudios)

// save an audio route
router.post('/', saveAudio)

// delete an audio route
router.delete('/:id', deleteAudio)

module.exports = router

