const express = require("express");
const { createJob, allJobs, getJobById } = require("../controller/post");
const { auth, companyAuth } = require("../middleWare/auth");
// const auth = require("../middleWare/auth")


const router = express.Router();


router.post("/postJob", auth, companyAuth, createJob)
router.get("/Jobs", auth, allJobs)
router.get("/Jobs/:id", auth, getJobById)






module.exports = router;