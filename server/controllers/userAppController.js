require("dotenv").config();
const mongoose = require("mongoose");

const UserApp = require("../models/userAppModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Audio = require("../models/audioModel");

// controller functions
const { addUserNotification } = require("./userNotificationController");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// auth token for userApp
const userAppAuth = async (req, res) => {
  const { app_id, app_secret } = req.body;

  try {
    const user = await UserApp.login(app_id, app_secret);
    // create a token
    const token = createToken(user.userId);

    // return Bearer token
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// useing User model, get all users where {role: "user"}
const getUserList = async (req, res) => {
  try {
    // Use the User model to find all users with user type "user"
    const adminUsers = await User.find({ role: "user" }).select("_id, name");

    // Send the list of users as a JSON response
    res.status(200).json(adminUsers);
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: "Error retrieving users" });
  }
};

getuserNameEmail = async (req, res) => {
  try {
    // Use the User model to find users with the specified IDs
    const { users } = req.body;
    const userNameEmail = await User.find({ _id: { $in: users } }).select(
      "name email"
    );
    const userNameEmailObj = userNameEmail.map((user) => {
      return {
        Name: user.name,
        Email: user.email,
      };
    });

    return userNameEmailObj;
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: error.message });
  }
};

// Email notifications
const sendEmail = async (req, res) => {
  const sendTo = await getuserNameEmail(req, res);

  const TextPart = `      Hi,
  
  You have a new notification: ${req.body.title}.

  Access the web app here: https://hivo.online.

  Best regards,
  HiVO`;

  const HTMLPart = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Notification</title>
  </head>
  <body>
      <div style="font-family: Arial, sans-serif;">
          <p>Hi,</p>
  
          <p>You have a new notification: <strong>${req.body.title}</strong>.</p>
  
          <p>Access the web app <a href="https://hivo.online">here</a>.</p>
  
          <p>Best regards,<br>HiVO</p>
      </div>
  </body>
  </html>`;
  // connect mailjet and send email
  const mailjet = require("node-mailjet").apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_API_SECRET
  );

  try {
    mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL,
            Name: process.env.NAME,
          },
          To: sendTo,
          Subject: `[hiVO] ${req.username} sent you an audio`,
          TextPart: TextPart,
          HTMLPart: HTMLPart,
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
};

// Add new audio and upload file
const addAudio = async (req, res) => {
  // ensure req.body has title property
  if (!req.body.title) {
    return res.status(400).json({ message: "No title was specified." });
  }

  // ensure req.body has description property
  if (!req.body.description) {
    return res.status(400).json({ message: "No description was specified." });
  }

  // ensure req.body has audioFile property
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  const audioFile = req.files.audioFile;
  // Check if the uploaded file is an audio file with a valid extension
  const allowedExtensions = [
    ".wav",
    ".wave",
    ".aif",
    ".mp3",
    ".x-wav",
    ".acc",
    ".m4a",
    ".mpeg",
    ".flac",
  ];
  const fileExtension = audioFile.name
    .substring(audioFile.name.lastIndexOf("."))
    .toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({
      message:
        "Invalid file type. Supported types: .wav, .mp3, .wave, .aif, .x-wav, .acc, .m4a, .mpeg, .flac.",
    });
  }

  // ensure req.body has users property with valid mongo id
  if (!req.body.users) {
    return res.status(400).json({ message: "No users were specified." });
  }

  // create an array from users
  req.body.users = Array.isArray(req.body.users)
    ? req.body.users
    : [req.body.users];

  // Check each ID in the array and throw an error if any ID is invalid
  if (
    req.body.users.some((userId) => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    return res
      .status(400)
      .json({ message: 'Invalid MongoDB ID found in the "users" array.' });
  }

  const uploadPath = __dirname + "/../public/audio/" + `${audioFile.name}`;

  //audioType
  const audio = "audio/" + fileExtension.substring(1);

  const { title, description, draft } = req.body;

  /**
   * promise to save audio then file upload - returns a promise
   */
  new Promise((resolve, reject) => {
    const newAudio = Audio.create({
      audio,
      title,
      description,
      draft,
    });

    if (!newAudio) {
      reject("Error creating new audio.");
    } else {
      resolve(newAudio);
    }
  })
    .then((newAudio) => {
      return new Promise((resolve, reject) => {
        const notificationObj = {
          userType: "admin",
          link: `${newAudio._id}${fileExtension}`,
          audioId: `${newAudio._id}`,
          videoId: null,
          url: null,
          notificationSent: 0,
        };
        // merge notificationObj with req.body
        req.body = Object.assign({}, req.body, notificationObj);
        req.result = { audioId: newAudio._id.toHexString() };

        const uploadPath =
          __dirname + "/../public/audio/" + `${newAudio._id}${fileExtension}`;
        audioFile.mv(uploadPath, function (err) {
          if (err) {
            reject("Error storing audio file.");
          } else {
            // create audio url including http or https + host name, port and path
            const audioUrl =
              req.protocol +
              "://" +
              req.get("host") +
              "/api/v1/media/audio/" +
              `${newAudio._id}${fileExtension}`;
            req.result.url = audioUrl;

            resolve(newAudio);
          }
        });
      });
    })

    .then(async (newAudio) => {
      await addUserNotification(req);
      sendEmail(req, res);

      res.status(200).json(req.result);
      return;
    })
    .catch((error) => {
      // Reject promise with error
      res.status(500).json(error);
    });
};

module.exports = {
  addAudio,
  userAppAuth,
  getUserList,
};
