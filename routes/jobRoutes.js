const express = require("express");
const { createJob, allJobs, getJobById, updateJobStatus, jobsByCompany } = require("../controller/post");
const { auth, companyAuth } = require("../middleWare/auth");
const { applyJob, getApplicantsForJob, withdrawApplication, totalApplicationByUser } = require("../controller/applyJob");
const { upload } = require("../config/multerConfig");
// const auth = require("../middleWare/auth")


const router = express.Router();


router.post("/postJob", auth, companyAuth, createJob)
router.get("/Jobs", auth, allJobs)
router.get("/companyJobs", auth, companyAuth, jobsByCompany)
router.get("/Jobs/:id", auth, getJobById)

router.patch("/job/:id/status", auth, companyAuth, updateJobStatus);

router.post("/applyJob/:id",
    upload.single("resume"),
    auth,
    applyJob
)
router.get("/job/:id/applicants", auth, companyAuth, getApplicantsForJob);
router.get("/user/applications", auth, totalApplicationByUser);

router.delete("/withdraw/:id", auth, withdrawApplication);






module.exports = router;