require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
const jwtSecret = process.env.JWT_SECRET;
const nodemailer = require('nodemailer');
const userModel = require('../models/Auth');
const Company = require('../models/Company');
const UserProfile = require('../models/UserProfile');



// const userModel = require("../models/Auth");
// const JobSeekerProfile = require("../models/UserProfile");
// const CompanyProfile = require("../models/CompanyProfile");
// const bcrypt = require("bcrypt");

const register = async (req, res) => {
    const { fullName, username, email, password, userType } = req.body;

    try {

        if (!username || !email || !password || !fullName || !userType) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await userModel.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            userType
        });

        let profile;

        // Create profile based on user type
        if (userType === "jobSeeker") {

            profile = await UserProfile.create({
                user: newUser._id,
                fullName,
                email
            });

        } else if (userType === "company") {

            profile = await Company.create({
                user: newUser._id,
                companyName: fullName
            });

        }

        // Link profile to user
        newUser.profile = profile._id;
        await newUser.save();

        return res.status(201).json({
            success: true,
            msg: "User registered successfully",
            user: newUser
        });

    } catch (error) {

        console.error("Registration error:", error);

        return res.status(500).json({
            error: "Failed to register"
        });

    }
};




const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.isBlocked) {
            return res.status(403).json({ error: "Your account has been blocked by the admin." });
        }
        if (user.isSuspended) {
            if (user.suspensionEndDate && user.suspensionEndDate > Date.now()) {
                const formattedDate = new Date(user.suspensionEndDate).toLocaleString();
                return res.status(403).json({
                    error: `Your account is suspended until ${formattedDate}`
                });
            } else {
                user.isSuspended = false;
                user.suspensionEndDate = null;
                await user.save();
            }
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                statusCode: "00",
                error: "Invalid credentials"
            });
        }
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '5h' });

        user.lastLogin = new Date();
        await user.save();

        return res.json({
            msg: "Logged in successfully",
            user,
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};



const changePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Invalid credentials" });
        }

        if(newPassword === oldPassword){
            return res.status(400).json({ error: "New password cannot be the same as the old password" });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            statusCode: "01",
            msg: "Password changed successfully"
        });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({ error: "An error occurred while changing the password" });
    }
};


const userProfile = async (req, res) => {

}



module.exports = {
    register,
    login,
    changePassword
};