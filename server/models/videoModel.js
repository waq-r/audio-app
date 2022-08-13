const mongoose = require('mongoose')

const Schema = mongoose.Schema


const videoSchema = new Schema({
    video: {
        type: String,
        required: true
    },
    audioId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Video = mongoose.model('Video', videoSchema)

module.exports = Video