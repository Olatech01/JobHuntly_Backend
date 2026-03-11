const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const profileSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    fullName: String,
    email: String,
    phone: String,
    location: String,
    skills: [String],
    resume: String,
    profilePicture: {
        type: String,
        default: ""
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'executive'],
    }
}, { timestamps: true });

module.exports = model("Profile", profileSchema);