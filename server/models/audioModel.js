const mongoose = require('mongoose')

const Schema = mongoose.Schema

const audioSchema = new Schema({
    audio: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const Audio = mongoose.model('Audio', audioSchema)
module.exports = Audio