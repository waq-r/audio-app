require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("./app");

const User = require("./models/userModel");
const Audio = require("./models/audioModel");
//const Notification = require("./models/notificationModel");
const UserNotification = require("./models/userNotificationModel");

const user = { name: "JD", email: "waqar3@gmail.com", password: "123456" };
const audio = { audio: "test", title: "test", description: "test" };
//const notification = { title: "test", link: "test", forWhom: "user" };
const userNotification = {
  title: "test notification",
  link: "test.test",
  audioId: null,
  videoId: null,
  read: false,
};

beforeAll(async () => {
  await mongoose.disconnect();

  await mongoose
    .connect(process.env.MONGO_URI)
    .then(
      app.listen(4000, () => {
        console.log("Connected to DB, port:4000");
      })
    )
    .catch((error) => {
      console.log(error);
    });
}, 30000);

afterAll(async () => {
  await User.findByIdAndDelete(user._id);
  await Audio.findByIdAndDelete(audio._id);
  //await Notification.findByIdAndDelete(notification._id);
  await UserNotification.findByIdAndDelete(userNotification._id);
  await mongoose.disconnect();
}, 30000);

describe("User signup, login", () => {
  test("It should response the GET method", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });

  it("It should signup the user", async () => {
    const response = await request(app)
      .post("/api/user/signup")
      .send(user)
      .set("Accept", "application/json")
      .expect(200);
    return response;
  });

  it("Should login a user", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .send({
        password: user.password,
        email: user.email,
      })
      .expect(200);
    Object.assign(user, response.body);
  });
});

describe("New Audio & Notification", () => {
  it("Should add new audio", async () => {
    const response = await request(app)
      .post("/api/audio")
      .send(audio)
      .set("Authorization", `Bearer ${user.token}`)
      .expect(200);
    Object.assign(audio, response.body);
  });

  //   it("Should add new notification", async () => {
  //     const response = await request(app)
  //       .post("/api/notification/add")
  //       .send(notification)
  //       .set("Authorization", `Bearer ${user.token}`)
  //       .expect(201);
  //     Object.assign(notification, response.body);
  //     console.log(notification);
  //   });

  it("Should add UserNotification", async () => {
    Object.assign(userNotification, {
      users: [user._id],
      audioId: audio._id,
    });
    const response = await request(app)
      .post("/api/usernotification")
      .send(userNotification)
      .set("Authorization", `Bearer ${user.token}`)
      .expect(200);
    Object.assign(userNotification, ...response.body);
    return response;
  }, 10000);
});
