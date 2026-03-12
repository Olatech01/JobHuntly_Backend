const Company = require("../models/Company");
const JobPost = require("../models/JobPost");




const createJob = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (user.userType !== 'company') {
            return res.status(403).json({
                message: "Only company accounts can post jobs"
            });
        }

        const companyDoc = await Company.findOne({ user: user._id });

        if (!companyDoc) {
            return res.status(400).json({
                message: "Company profile not found. Please complete your company profile first."
            });
        }

        const {
            jobTitle,
            employmentType,
            salary,
            categories,
            skills,
            capacity,
            // deadline,
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
            capacity,
            deadline: req.body.deadline ? new Date(req.body.deadline) : null,
            jobDescriptions,
            responsibilities,
            whoYouAre,
            company: companyDoc._id,
            niceToHaves,
            perksAndBenefits
        });

        const populated = await JobPost.findById(job._id)
            .populate({
                path: 'company',
                select: 'companyName companyLogo website location'
            });

        res.status(201).json({
            status: "success",
            message: "Job created successfully",
            data: populated || job
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const jobs = await JobPost.find()
            .populate({
                path: 'company',
                select: 'companyLogo companyName website location industry',
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalJobs = await JobPost.countDocuments();

        res.status(200).json({
            message: "Jobs retrieved successfully",
            currentPage: page,
            totalPages: Math.ceil(totalJobs / limit),
            totalJobs,
            jobs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }

}

const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await JobPost.findById(jobId)
            .populate({
                path: 'company',
                select: 'companyLogo companyName website location',
            })
            .exec();

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({
            message: "Job retrieved successfully",
            job
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const jobsByCompany = async (req, res) => {

}


module.exports = { createJob, allJobs, getJobById };