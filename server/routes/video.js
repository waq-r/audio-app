const express = require('express')
const router = express.Router()

// controller functions
const { getVideo, getAllVideos, addVideo, deleteVideo } = require('../controllers/videoController')

// get a video route
router.get('/:id', getVideo)

// get all videos route
router.get('/', getAllVideos)

// save a video route
router.post('/add', addVideo)

// delete a video route
router.delete('/:id', deleteVideo)

module.exports = router