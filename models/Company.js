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


companySchema.virtual("companyLogoUrl").get(function () {
    if (!this.companyLogo) return null;

    return `${process.env.BASE_URL || "http://localhost:6060"}${this.companyLogo.startsWith("/") ? "" : "/"}${this.companyLogo}`;
});

companySchema.set("toJSON", { virtuals: true });
companySchema.set("toObject", { virtuals: true });


module.exports = model("Company", companySchema);


