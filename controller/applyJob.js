const Application = require("../models/Application");
const JobPost = require("../models/JobPost");
const UserProfile = require("../models/UserProfile");

const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const existing = await Application.findOne({ user: req.user._id, job: jobId });
    if (existing) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    const userProfile = await UserProfile.findOne({ user: req.user._id });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Get resume from uploaded file or fallback to profile resume
    let resume = userProfile.resume;
    if (req.file) {
      resume = req.file.path; // Cloudinary URL of uploaded PDF
    }

    if (!resume) {
      return res.status(400).json({ message: "Resume is required. Please upload a PDF or add one to your profile." });
    }

    const application = await Application.create({
      user: req.user._id,
      job: jobId,
      fullName: userProfile.fullName,
      email: userProfile.email,
      phone: userProfile.phone,
      resume,
      coverLetter: req.body.coverLetter,
      portfolio: req.body.portfolio,
      jobTitle: req.body.jobTitle,
    });


    await JobPost.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { applyJob };