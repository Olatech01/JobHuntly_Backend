const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const team = new Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    teamImage: {
        type: String,
        default: ""
    },
    teamImagePublicId: {
        type: String,
    },
    name: String,
    role: String,
    instagramUrl: String,
    twitterUrl: String,
    linkedInUrl: String,
}, { timestamps: true })


module.exports = model("Team", team);