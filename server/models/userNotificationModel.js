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
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const UserNotification = mongoose.model('UserNotification', userNotificationSchema)

module.exports = UserNotification