const express = require("express");
const { register, login, changePassword } = require("../controller/auth");
const { auth } = require("../middleWare/auth");
const { getProfile, updateProfile } = require("../controller/userProfile");
// const auth = require("../middleWare/auth")


const router = express.Router();

// const authController = require("../controller/auth");


router.post("/register", register);
router.post("/login", login);
router.post("/change-password", auth, changePassword);
router.get("/profile", auth, getProfile)
router.put("/profile", auth, updateProfile)

module.exports = router;