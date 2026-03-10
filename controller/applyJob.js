const Application = require("../models/Application");
const UserProfile = require("../models/UserProfile");

const applyJob = async (req, res) => {
  try {

    const jobId = req.params.id;

    const user = await UserProfile.findById(req.user._id);

    const application = await Application.create({
      user: user._id,
      job: jobId,

      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      resume: user.resume,
      coverLetter: req.body.coverLetter,
      portfolio: req.body.portfolio
    });

    res.json({
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  applyJob
}