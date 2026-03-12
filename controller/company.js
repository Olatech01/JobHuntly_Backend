const Company = require("../models/Company");




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


module.exports = {
    getAllCompany
}