const { cloudinary } = require("../config/multerConfig");
const userModel = require("../models/Auth");
const Company = require("../models/Company");
const UserProfile = require("../models/UserProfile");

// GET /api/profile
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
            .select("-password")
            .populate({
                path: "profile",
                select: "-__v"
            })
            .populate({
                path: "company",
                select: "-__v"
            });

        console.log("user: ", user._id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.profile) {
            return res.status(404).json({ message: 'Profile not yet created' });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    fullName: user.fullName,
                    email: user.email,
                    username: user.username,
                    userType: user.userType,
                    isAdmin: user.isAdmin,
                    lastLogin: user.lastLogin,
                },
                profile: user.profile
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getCompanyProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
            .select("-password")
            .populate({
                path: "company",
                select: "-__v"
            });

        console.log("user: ", user._id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.company) {
            return res.status(404).json({ message: 'Profile not yet created' });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    fullName: user.fullName,
                    email: user.email,
                    username: user.username,
                    userType: user.userType,
                    isAdmin: user.isAdmin,
                    lastLogin: user.lastLogin,
                },
                company: user.company
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


// const { cloudinary } = require("../config/upload"); // adjust path if needed

const updateCompanyProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            fullName,
            email,
            companyName,
            website,
            industry,
            companySize,
            location,
            description,
            contact,
        } = req.body;

        let companyLogo;
        let companyLogoPublicId;

        if (req.file) {
            companyLogo = req.file.path;           // full Cloudinary https:// URL
            companyLogoPublicId = req.file.filename; // public_id for deletion later
        }

        const allowedFields = {
            fullName,
            email,
            companyName,
            website,
            industry,
            companySize,
            location,
            companyLogo,
            companyLogoPublicId,
            description,
            contact
        };

        // Remove undefined fields
        Object.keys(allowedFields).forEach(
            key => allowedFields[key] === undefined && delete allowedFields[key]
        );

        let companyProfile = await Company.findOne({ user: userId });

        if (!companyProfile) {
            companyProfile = await Company.create({
                user: userId,
                ...allowedFields
            });

            await userModel.findByIdAndUpdate(userId, {
                companyProfile: companyProfile._id
            });

        } else {
            // Delete old logo from Cloudinary before updating
            if (req.file && companyProfile.companyLogoPublicId) {
                await cloudinary.uploader.destroy(companyProfile.companyLogoPublicId);
            }

            companyProfile = await Company.findOneAndUpdate(
                { user: userId },
                { $set: allowedFields },
                { new: true, runValidators: true }
            );
        }

        res.status(200).json({
            success: true,
            message: "Company Profile updated successfully",
            data: companyProfile
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// PUT /api/profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            fullName,
            email,
            phone,
            location,
            skills,
            aboutMe,
            resume,
            experienceLevel
        } = req.body;

        let profilePicture;
        let profilePicturePublicId;

        if (req.file) {
            profilePicture = req.file.path;
            profilePicturePublicId = req.file.filename;
        }

        const allowedFields = {
            fullName,
            email,
            phone,
            location,
            skills,
            resume,
            aboutMe,
            experienceLevel,
            profilePicture,
            profilePicturePublicId
        };

        Object.keys(allowedFields).forEach(
            key => allowedFields[key] === undefined && delete allowedFields[key]
        );

        let profile = await UserProfile.findOne({ user: userId });

        if (!profile) {

            profile = await UserProfile.create({
                user: userId,
                ...allowedFields
            });

            await userModel.findByIdAndUpdate(userId, {
                profile: profile._id
            });

        } else {
            if (req.file && profile.profilePicturePublicId) {
                await cloudinary.uploader.destroy(profile.profilePicturePublicId);
            }
            profile = await UserProfile.findOneAndUpdate(
                { user: userId },
                { $set: allowedFields },
                { new: true, runValidators: true }
            );
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: profile
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = { getProfile, updateProfile, getCompanyProfile, updateCompanyProfile };