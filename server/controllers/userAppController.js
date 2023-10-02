require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

const UserApp = require("../models/userAppModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Audio = require("../models/audioModel");

// controller functions
const { addUserNotification } = require("./userNotificationController");

/**
 * Create a token with the given user ID
 *
 * @param {string} _id - The user ID
 * @returns {string} - The generated token
 */
const createToken = (_id) => {
  // Sign the user ID with the secret key and set the expiration time to 3 days
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

/**
 * Authenticates the user for the user app.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the authentication is complete.
 */
const userAppAuth = async (req, res) => {
  const { app_id, app_secret } = req.body;

  try {
    // Login the user app
    const user = await UserApp.login(app_id, app_secret);

    // Create a token for the user
    const token = createToken(user.userId);

    // Send the token as a response
    res.status(200).json({ token });
  } catch (error) {
    // Send an error response if authentication fails
    res.status(400).json({ error: error.message });
  }
};

/**
 * Retrieve a list of users with the role "user".
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The list of users with their id and name as a JSON response.
 */
const getUserList = async (req, res) => {
  try {
    // Use the User model to find all users with the role "user"
    const users = await User.find({ role: "user" }).select("_id name");

    // Send the list of users as a JSON response
    res.status(200).json(users);
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: "Error retrieving users" });
  }
};

// Helper function to get the file extension
const getFileExtension = (filename) => {
  return "." + filename.split(".").pop();
};

/**
 * Retrieves the name and email of users with the specified IDs
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Array} - An array of objects containing the name and email of users
 * @throws {Error} - If there is an error during the database query
 */
getUserNameEmail = async (req, res) => {
  try {
    // Retrieve the IDs of users from the request body
    const { users } = req.body;

    // Find users with the specified IDs and select only the name and email fields
    const userNameEmail = await User.find({ _id: { $in: users } }).select(
      "name email"
    );

    // Map the retrieved users to an array of objects with name and email properties
    const userNameEmailObj = userNameEmail.map((user) => {
      return {
        Name: user.name,
        Email: user.email,
      };
    });

    // Return the array of objects containing the name and email of users
    return userNameEmailObj;
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: error.message });
  }
};

// This function sends email notifications to the recipient.
// It retrieves the recipient's email address using the `getuserNameEmail` function.
// The email contains a text part and an HTML part.
const sendEmail = async (req, res) => {
  // Retrieve the recipient's email address
  const sendTo = await getUserNameEmail(req, res);

  // Define the text part of the email
  const TextPart = `Hi,

You have a new notification: ${req.body.title}.

Access the web app here: https://hivo.online.

Best regards,
HiVO`;

  // Define the HTML part of the email
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

  // Connect to Mailjet using the API key and secret
  const mailjet = require("node-mailjet").apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_API_SECRET
  );

  try {
    // Send the email using Mailjet
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

/**
 * Adds an audio file to the database and performs necessary validations.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object.
 */
const addAudio = async (req, res) => {
  // Check if title is specified
  if (!req.body.title) {
    return res.status(400).json({ message: "No title was specified." });
  }

  // Check if description is specified
  if (!req.body.description) {
    return res.status(400).json({ message: "No description was specified." });
  }

  // Check if files were uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  const audioFile = req.files.audioFile;

  // Define the allowed file extensions
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

  // Get the file extension of the uploaded audio file
  const fileExtension = audioFile.name
    .substring(audioFile.name.lastIndexOf("."))
    .toLowerCase();

  // Check if the file extension is valid
  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({
      message:
        "Invalid file type. Supported types: .wav, .mp3, .wave, .aif, .x-wav, .acc, .m4a, .mpeg, .flac.",
    });
  }

  // Check if users are specified
  if (!req.body.users) {
    return res.status(400).json({ message: "No users were specified." });
  }

  // Convert users to an array if it is not already an array
  req.body.users = Array.isArray(req.body.users)
    ? req.body.users
    : [req.body.users];

  // Check if all user IDs are valid MongoDB IDs
  if (
    req.body.users.some((userId) => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    return res
      .status(400)
      .json({ message: 'Invalid MongoDB ID found in the "users" array.' });
  }

  // Set the upload path for the audio file
  const uploadPath = path.join(
    __dirname,
    "..",
    "public",
    "audio",
    audioFile.name
  );

  // Set the audio file path
  const audio = `audio/${fileExtension.substring(1)}`;

  // Get the title, description, and draft from the request body
  const { title, description, draft } = req.body;
  // new promise wrapper around try block to handle errors
  return new Promise(async (resolve, reject) => {
    // Create a new audio file in the database
    const newAudio = await Audio.create({ audio, title, description, draft });

    // Create a notification object
    const notificationObj = {
      userType: "admin",
      link: `${newAudio._id}${fileExtension}`,
      audioId: `${newAudio._id}`,
      videoId: null,
      url: null,
      notificationSent: 0,
    };

    // Merge the notification object with the request body
    req.body = { ...req.body, ...notificationObj };

    // Set the audioId in the response object
    req.result = { audioId: newAudio._id.toHexString() };

    // Set the upload path for the audio file
    const uploadPath = path.join(
      __dirname,
      "..",
      "public",
      "audio",
      `${newAudio._id}${fileExtension}`
    );
    await audioFile.mv(uploadPath);
    const audioUrl = `https://${req.get("host")}/api/v1/media/audio/${
      newAudio._id
    }${fileExtension}`;
    req.result.url = audioUrl;
    await addUserNotification(req);
    // sendEmail(req, res);
    res.status(200).json(req.result);
  }).catch((error) => {
    res.status(500).json(error);
  });
};

// Export the controller functions
module.exports = {
  addAudio,
  userAppAuth,
  getUserList,
};
