const mongoose = require('mongoose')

const Schema = mongoose.Schema


const videoSchema = new Schema({
    video: {
        type: String,
        required: true
    },
    audioId: {
        type: Schema.Types.ObjectId,
        ref: 'Audio',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Video = mongoose.model('Video', videoSchema)

module.exports = Video