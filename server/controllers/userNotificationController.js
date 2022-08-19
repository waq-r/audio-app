const mongoose = require('mongoose')
const UserNotification = require('../models/userNotificationModel')

//save notification
const addUserNotification = async (req, res) => {
    const {user, notification} = req.body

    try {
    const userNotification  = await UserNotification.create({user, notification})
    res.status(201).json(userNotification)
    } 
    catch (error) {
        res.status(400).json({error: error.message})
    }

}

// get all notifications for a user
const getAllUserNotifications = async (req, res) => {
    const {id} = req.params
    
    const userNotifications = await UserNotification.find({user: id}).populate('notification').sort({createdAt: -1}).limit(100)

    if(!userNotifications) {
        return res.status(404).send('No notifications')
    }

    res.status(200).json(userNotifications)
}

//update notification
const markNotificationAsRead = async (req, res) => {
    const {id} = req.params
    const {read} = req.body

    try {
    const userNotification = await UserNotification.findByIdAndUpdate(id, {read}, {new: true})
    res.status(200).json(userNotification)
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

//count user's unread notifications
const countUnreadNotifications = async (req, res) => {
    const {id} = req.params
    try {
    const unreadNotifications = await UserNotification.countDocuments({user: id, read: false})
    res.status(200).json(unreadNotifications)
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    addUserNotification,
    getAllUserNotifications,
    markNotificationAsRead,
    countUnreadNotifications,
}
