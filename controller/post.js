// const JobPost = require("../models/jobPost");

const JobPost = require("../models/JobPost");

const createJob = async (req, res) => {
    try {
        const {
            jobTitle,
            employmentType,
            salary,
            categories,
            skills,
            jobDescriptions,
            responsibilities,
            whoYouAre,
            niceToHaves,
            perksAndBenefits
        } = req.body;

        const job = await JobPost.create({
            jobTitle,
            employmentType,
            salary,
            categories,
            skills,
            jobDescriptions,
            responsibilities,
            whoYouAre,
            niceToHaves,
            perksAndBenefits
        });

        res.status(201).json({
            status: "success",
            message: "Job created successfully",
            data: job
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};


const allJobs = async (req, res) => {
    try {
        const jobs = await JobPost.find()
        // .populate('creator', 'username email profilePicture')
        // .populate('inviteMembers', 'username email profilePicture')
        // .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Jobs retrived successfully",
            jobs
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createJob, allJobs };