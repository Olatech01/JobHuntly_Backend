const express = require("express");
const { createJob, allJobs, getJobById } = require("../controller/post");
const { auth, companyAuth } = require("../middleWare/auth");
const { applyJob } = require("../controller/applyJob");
const { upload } = require("../config/multerConfig");
// const auth = require("../middleWare/auth")


const router = express.Router();


router.post("/postJob", auth, companyAuth, createJob)
router.get("/Jobs", auth, allJobs)
router.get("/Jobs/:id", auth, getJobById)

router.post("/applyJob/:id",
    upload.single("resume"),
    auth,
    applyJob
)






module.exports = router;