const mongoose = require("mongoose");
const UserNotification = require("../models/userNotificationModel");
const User = require("../models/userModel");
const Audio = require("../models/audioModel");
const Notification = require("../models/notificationModel");

//save notification
const addUserNotification = async (req, res) => {
  let { users, userType, title, link, audioId, videoId } = req.body;

  //create a notification using Notification create
  const notification = await Notification.create({ title, link });
  if (!notification)
    return res.status(400).json({ msg: "Failed to create notification" });

  if (!users || users.length === 0) {
    // get Users where user.role is admin/user
    users = await User.find({ role: userType }, "_id").exec();
    users = users.map((user) => user._id.toHexString());
  }

  // add notification._id, read and audio._id to users array
  const notifications = users.map((usr) => {
    return {
      user: usr,
      notification: notification._id,
      read: false,
      audioId: audioId || null,
      videoId: videoId || null,
    };
  });

  // insert many notifications to user notification collection in mongo db
  try {
    const userNotifications = await UserNotification.insertMany(notifications);
    // Mark audio.draft to false
    if (audioId) {
      await Audio.findByIdAndUpdate(audioId, { draft: false });
    }
    if (res) {
      res.status(200).json(userNotifications);
    } else {
      req.result = Object.assign({}, req.result, {
        notificationsSent: userNotifications.length || 0,
      });
    }
  } catch (err) {
    if (res) {
      res.status(500).json(err);
    } else {
      req.result = Object.assign({}, req.result, {
        error: "Error sneding user notifications",
        notificationsSent: 0,
      });
    }
  }
};

// get all notifications for a user
const getAllUserNotifications = async (req, res) => {
  const { id } = req.params;

  const userNotifications = await UserNotification.find({ user: id })
    .populate("notification")
    .sort({ createdAt: -1 })
    .limit(100);

  if (!userNotifications) {
    return res.status(404).send("No notifications");
  }

  res.status(200).json(userNotifications);
};

//update notification
const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const userNotification = await UserNotification.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json(userNotification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//count user's unread notifications
const countUnreadNotifications = async (req, res) => {
  const { id } = req.params;
  try {
    const unreadNotifications = await UserNotification.countDocuments({
      user: id,
      read: false,
    });
    res.status(200).json(unreadNotifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get User Notification stats (video uploaded, read, downloaded)
const getUserNotificationStats = async (req, res) => {
  const { id } = req.params;
  try {
    const userNotificationStats = await UserNotification.find({ user: id })
      .populate("notification")
      .populate("videoId")
      .populate("audioId")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json(userNotificationStats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// show details of a notification
const getNotificationDetails = async (req, res) => {
  try {
    const UserNotificationDetails = await UserNotification.findById(
      req.params.id
    )
      .populate("user", "name")
      .populate("notification")
      .populate("videoId")
      .populate("audioId");

    res.status(200).json(UserNotificationDetails);
  } catch (err) {
    return res.status(404).json({ msg: err.message });
  }
};

module.exports = {
  addUserNotification,
  getAllUserNotifications,
  markNotificationAsRead,
  countUnreadNotifications,
  getUserNotificationStats,
  getNotificationDetails,
};
