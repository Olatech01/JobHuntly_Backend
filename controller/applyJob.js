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

const totalApplicationByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ user: userId })
      // .populate({
      //   path: "job",
      //   select: "jobTitle employmentType salary deadline companyName"
      // })
      .populate({
        path: "job",
        select: "jobTitle employmentType salary deadline",
        populate: {
          path: "company",
          select: "companyName companyLogo"
        }
      })
      .sort({ createdAt: -1 });

    const totalApplications = applications.length;

    res.status(200).json({
      totalApplications,
      applications
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};



const getApplicantsForJob = async (req, res) => {
  try {

    const jobId = req.params.id;

    const job = await JobPost.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalApplicants: applications.length,
      applicants: applications
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};





const withdrawApplication = async (req, res) => {
  try {

    const jobId = req.params.id;

    const application = await Application.findOne({
      job: jobId,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    await application.deleteOne();

    await JobPost.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: -1 }
    });

    res.status(200).json({
      message: "Application withdrawn successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};




module.exports = { applyJob, withdrawApplication, getApplicantsForJob, totalApplicationByUser };