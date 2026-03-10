const express = require("express");
const { createJob, allJobs } = require("../controller/post");
const { auth, companyAuth } = require("../middleWare/auth");
// const auth = require("../middleWare/auth")


const router = express.Router();


router.post("/postJob", auth, companyAuth, createJob)
router.get("/Jobs", auth, allJobs)






module.exports = router;