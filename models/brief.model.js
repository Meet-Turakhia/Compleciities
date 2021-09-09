// importing database
const mongoose = require("mongoose");

// importing mangoose funtionalities
ObjectId = mongoose.Schema.ObjectId;

// brief schema
var briefSchema = new mongoose.Schema({
    marker_id: {
        type: ObjectId,
        required: "This field is required"
    },
    title: {
        type: String,
        required: "This field is required"
    },
    brief: {
        type: String,
        required: "This field is required"
    },
    media: {
        type: [Object],
        required: "This field is required"
    },
});

mongoose.model("briefs", briefSchema);