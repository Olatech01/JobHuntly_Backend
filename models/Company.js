const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const companySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    companyName: String,
    companyLogo: {
        type: String,
        default: ""
    },
    companyLogoPublicId: {
        type: String,
    },
    website: String,
    industry: [String],
    companySize: String,
    location: String,
    description: String
})


companySchema.set("toJSON", { virtuals: true });
companySchema.set("toObject", { virtuals: true });

companySchema.virtual("jobsCount", {
    ref: "jobPosts",           
    localField: "_id",    
    foreignField: "company",
    count: true  
});

module.exports = model("Company", companySchema);