const express = require("express");
const { register, login, changePassword } = require("../controller/auth");
const { auth, companyAuth } = require("../middleWare/auth");
const { getProfile, updateProfile, updateCompanyProfile, getCompanyProfile } = require("../controller/userProfile");
const upload = require("../config/multerConfig");
// const auth = require("../middleWare/auth")


const router = express.Router();

// const authController = require("../controller/auth");


router.post("/register", register);
router.post("/login", login);
router.post("/change-password", auth, changePassword);
router.get("/profile", auth, getProfile)
router.put("/profile",
    upload.single("profilePicture"),
    auth,
    updateProfile
)
router.put("/companyProfile",
    auth,
    companyAuth,
    upload.single("companyLogo"),
    updateCompanyProfile
)
router.get("/companyProfile", auth, companyAuth, getCompanyProfile)

module.exports = router;