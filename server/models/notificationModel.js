const mongoose = require('mongoose')

const Schema = mongoose.Schema

const notificationSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        required: true
    },
    createdAt: {
            type: Date,
            default: Date.now
        },
})

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification