const express = require("express");
const fileUpload = require("express-fileupload");

const userRoutes = require("./routes/user");
const userAppRoutes = require("./routes/userApp");
const fileRoutes = require("./routes/file");
const videoRoutes = require("./routes/video");
const audioRoutes = require("./routes/audio");
const notificationRoutes = require("./routes/notification");
const userNotificationRoutes = require("./routes/userNotification");

// express app
const app = express();

// middleware
app.use(express.json());
app.use(fileUpload());

// routes
app.use("/api/audio", audioRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/user", userRoutes);
app.use("/api/v1", userAppRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/usernotification", userNotificationRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

module.exports = app;
