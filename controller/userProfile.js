// const User = require('../models/user.model');
// const Profile = require('../models/profile.model');

const userModel = require("../models/Auth");
const UserProfile = require("../models/UserProfile");

// GET /api/profile
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
            .select('-password');

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

// PUT /api/profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, email, phone, location, skills, resume, experienceLevel } = req.body;

        const allowedFields = { fullName, email, phone, location, skills, resume, experienceLevel };

        Object.keys(allowedFields).forEach(
            key => allowedFields[key] === undefined && delete allowedFields[key]
        );

        let profile = await UserProfile.findOne({ user: userId });

        if (!profile) {
            profile = await UserProfile.create({ user: userId, ...allowedFields });

            await userModel.findByIdAndUpdate(userId, { profile: profile._id });

        } else {
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
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getProfile, updateProfile };