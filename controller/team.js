const { cloudinary } = require("../config/multerConfig");
const Company = require("../models/Company");
const Team = require("../models/Team");





const addTeam = async (req, res) => {
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
            name,
            role,
            instagramUrl,
            twitterUrl,
            linkedInUrl
        } = req.body;


        // let teamImage;
        // let teamImagePublicId;


        let teamImage = "";
        let teamImagePublicId = "";

        if (req.file) {

            const uploaded = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "team_members"
                }
            );

            teamImage = uploaded.secure_url;
            teamImagePublicId = uploaded.public_id;
        }


        const team = await Team.create({
            company: companyDoc._id,
            name,
            role,
            instagramUrl,
            twitterUrl,
            teamImage,
            teamImagePublicId,
            linkedInUrl
        })

        res.status(201).json({
            status: "success",
            message: "Team Added successfully",
            data: team
        })


    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}



const allteamByCompany = async (req, res) => {
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

        const teams = await Team.find({
            company: companyDoc._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            totalMembers: teams.length,
            data: teams
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    addTeam,
    allteamByCompany
}