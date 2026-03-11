const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const jobPost = new Schema({
    jobTitle: {
        type: String,
        required: true
    },
    employmentType: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    categories: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
    },
    capacity: {
        type: Number,
    },
    skills: {
        type: [String],
        required: true
    },

    jobDescriptions: {
        type: String,
        required: true
    },
    responsibilities: {
        type: String,
        required: true
    },
    whoYouAre: {
        type: String,
        required: true
    },
    niceToHaves: {
        type: String,
        required: true
    },

    // ARRAY
    perksAndBenefits: {
        type: [String],
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",         
        required: true           
    },
    location: String,
    experienceLevel: String,
    remote: Boolean,

    applicationsCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = model("jobPosts", jobPost);