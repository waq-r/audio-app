const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userAppSchema = new Schema({
  appSecret: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
    required: true,
  },
});

// static login method
userAppSchema.statics.login = async function (app_id, app_secret) {
  if (!app_id || !app_secret) {
    throw Error("App ID and secret are required");
  }

  const user = await this.findOne({ app_id });
  if (!user) {
    throw Error("Invalid App ID");
  }

  const match = await bcrypt.compare(app_secret, user.appSecret);
  if (!match) {
    throw Error("Invalid App ID or secret");
  }

  return user;
};

// static signup method
userAppSchema.statics.createUserApp = async function (adminId, appSecret) {
  // validation
  if (!adminId || !appSecret) {
    throw Error("Admin ID and App Secret are required");
  }
  // hash app secret
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(appSecret, salt);

  const user = await this.create({ appSecret: hash, userId: adminId });

  return user;
};

const UserApp = mongoose.model("UserApp", userAppSchema);
module.exports = UserApp;
