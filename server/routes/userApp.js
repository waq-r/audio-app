const express = require("express");

// controller functions
const {
  userAppAuth,
  createUserApp,
  addAudio,
  getUserList,
} = require("../controllers/userAppController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.post("/oauth", userAppAuth);

// auth middleware
router.use(requireAuth);

// serve static /public directory
router.use("/media", express.static("public"));
//router.use(express.static("public"));

// add new audio route
router.post("/audio", addAudio);

// get user list route
router.get("/user-list", getUserList);

module.exports = router;
