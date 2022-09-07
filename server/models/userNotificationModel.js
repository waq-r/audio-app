const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userNotificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notification: {
        type: Schema.Types.ObjectId,
        ref: 'Notification',
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    audioId:{
        type: Schema.Types.ObjectId,
        ref: 'Audio',
        required: false,
        default: null
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: false,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const UserNotification = mongoose.model('UserNotification', userNotificationSchema)

module.exports = UserNotification