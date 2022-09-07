const express = require('express')
const router = express.Router()

// controller functions
const { getVideo, getAllVideos, addVideo, deleteVideo, updateVideo } = require('../controllers/videoController')

const requireAuth = require('../middleware/requireAuth')
const { use } = require('./user')

router.use(requireAuth)

// get a video route
router.get('/:id', getVideo)

// get all videos route
router.get('/', getAllVideos)

// save a video route
router.post('/add', addVideo)

// delete a video route
router.delete('/:id', deleteVideo)

// update a video
router.put('/:id', updateVideo)

module.exports = router