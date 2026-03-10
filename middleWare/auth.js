const jwt = require('jsonwebtoken');
const userModel = require('../models/Auth');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;


// General Authentication
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, jwtSecret);
        const user = await userModel.findOne({ _id: decoded.id });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({
            error: 'You are not authorized. Please login to continue...'
        });
    }
};


// Company Authorization
const companyAuth = async (req, res, next) => {
    try {

        // check if user exists from auth middleware
        if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized access"
            });
        }

        // check if user is company
        if (req.user.userType !== "company") {
            return res.status(403).json({
                error: "Only companies are allowed to post jobs"
            });
        }

        next();

    } catch (error) {
        res.status(500).json({
            error: "Authorization failed"
        });
    }
};

module.exports = { auth, companyAuth };