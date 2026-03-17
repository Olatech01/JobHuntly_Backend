const { cloudinary } = require("../config/multerConfig");
const Company = require("../models/Company");
const Stack = require("../models/Stack");




const getAllCompany = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const company = await Company.find()
            .populate("jobsCount")
            // .populate({
            //     path: 'company',
            //     select: 'companyLogo companyName website location',
            // })
            // .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalCompany = await Company.countDocuments();

        res.status(200).json({
            message: "Jobs retrieved successfully",
            currentPage: page,
            totalPages: Math.ceil(totalCompany / limit),
            totalCompany,
            company
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


const addStack = async (req, res) => {
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

        const { stackName } = req.body

        let stackImage = "";
        let stackImagePublicId = ""


        if (req.file) {

            const uploaded = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "stack"
                }
            );

            stackImage = uploaded.secure_url;
            stackImagePublicId = uploaded.public_id;
        }

        const stack = await Stack.create({
            company: companyDoc._id,
            stackName,
            stackImagePublicId,
            stackImage
        })

        res.status(201).json({
            status: "success",
            message: "Team Added successfully",
            data: stack
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

const allStacks = async (req, res) => {
    try {

        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }

        if (user.userType !== "company") {
            return res.status(403).json({
                message: "Only company accounts can view team members"
            });
        }

        const companyDoc = await Company.findOne({ user: user._id });

        if (!companyDoc) {
            return res.status(404).json({
                message: "Company profile not found"
            });
        }

        const stacks = await Stack.find({
            company: companyDoc._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            totalStacks: stacks.length,
            data: stacks
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


module.exports = {
    getAllCompany,
    addStack,
    allStacks
}