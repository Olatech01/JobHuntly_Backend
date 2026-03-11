const Company = require("../models/Company");
const JobPost = require("../models/JobPost");



const getFullUrl = (req, relativePath) => {
    if (!relativePath) return null; // or a default placeholder

    const protocol = req.get("x-forwarded-proto") || req.protocol; // handles https behind proxy
    const host = req.get("host"); // includes port if present (localhost:5000)

    // Remove leading slash if present, then add /
    const cleanPath = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;

    return `${protocol}://${host}${cleanPath}`;
};



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
            company: companyDoc._id,
            niceToHaves,
            perksAndBenefits
        });




        const populated = await JobPost.findById(job._id)
            .populate({
                path: 'company',
                select: 'companyName companyLogo website location'
            });


        if (populated && populated.company && populated.company.companyLogo) {
            populated.company.companyLogo = getFullUrl(
                req,
                populated.company.companyLogo
            );
        }

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
                path: "company",
                select: "companyName companyLogo website location",
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Transform EVERY job's companyLogo to full URL
        const enhancedJobs = jobs.map((job) => {
            const jobObj = job.toObject(); // convert to plain JS object (safer for mutation)

            if (jobObj.company && jobObj.company.companyLogo) {
                jobObj.company.companyLogo = getFullUrl(req, jobObj.company.companyLogo);
            }

            return jobObj;
        });

        const totalJobs = await JobPost.countDocuments();

        res.status(200).json({
            message: "Jobs retrieved successfully",
            currentPage: page,
            totalPages: Math.ceil(totalJobs / limit),
            totalJobs,
            jobs: enhancedJobs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createJob, allJobs };