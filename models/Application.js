const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const applicationSchema = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    },

    fullName: String,
    email: String,
    phone: String,

    resume: String,

    coverLetter: String,

    portfolio: String,

    status: {
        type: String,
        default: "pending"
    }

}, { timestamps: true });


module.exports = model("Applications", applicationSchema);