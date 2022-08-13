const { default: mongoose } = require('mongoose')
const Video = require('../models/videoModel')

// show all videos
const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find()
        res.status(200).json(videos)
    }
    catch (err) {
        return res.status(404).json({msg: err.message})
    }

}

// show one video
const getVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
        res.status(200).json(video)
    }
    catch (err) {
        return res.status(404).json({msg: err.message})
    }
}

// add a video
const addVideo = async (req, res) => {
    console.log("req.body ", req.body);
    try {
        const {video, audioId, userId} = req.body

        if(!video) return res.status(400).json({msg: 'No video file'})

        const newVideo = new Video({
            video,
            audioId,
            userId
        })

        const result = await newVideo.save()

        res.json(result)
    }
    catch (err) {
        return res.status(400).json({msg: err.message})
    }
}

// delete a video
const deleteVideo = async (req, res) => {
        const {id} = req.params

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({msg: 'Invalid ID. No such video'})
        }
    
        const video = await Video.findByIdAndDelete({_id: id})

        if(!video) {
            return res.status(400).json({msg: 'No such video'})
        }

        res.status(200).json({video})

}

module.exports = { getVideo, getAllVideos, addVideo, deleteVideo }