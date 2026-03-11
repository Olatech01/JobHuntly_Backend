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
    website: String,
    industry: String,
    companySize: String,
    location: String,
    description: String
})


module.exports = model("Company", companySchema);


