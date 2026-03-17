const mongoose = require('mongoose');
const { Schema, model } = mongoose;



const stack = new Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    stackImage: {
        type:String,
        default: ""
    },
    stackImagePublicId: {
        type: String
    },
    stackName: String
}, {timestamps: true })


module.exports = model("Stack", stack);