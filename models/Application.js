const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const applicationSchema = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobPosts"
    },

    fullName: String,
    email: String,
    phone: String,

    resume: {
        type:String,
        default: ""
    },
    coverLetter: String,

    portfolio: String,
    jobTitle: String,

    status: {
        type: String,
        enum: [
            "pending",
            "reviewed",
            "shortlisted",
            "rejected",
            "hired",
            "interviewing"
        ],
        default: "pending"
    }

}, { timestamps: true });


module.exports = model("Applications", applicationSchema);