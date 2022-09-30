const mongoose = require('mongoose')
const Notification = require('../models/notificationModel')

//save notification
const addNotification = async (req, res) => {
    const {title, forWhom, link} = req.body
    try {
    const notification  = await Notification.create({title, forWhom, link})
    res.status(201).json(notification)
    } 
    catch (error) {
        res.status(400).json({error: error.message})
    }

}

const getNotification = async (req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No notification with that id')
    }
    
    const notification = await Notification.findById(id)

    if(!notification) {
        return res.status(404).send('No such notification')
    }

    res.status(200).json({notification})
}


module.exports = {addNotification, getNotification}