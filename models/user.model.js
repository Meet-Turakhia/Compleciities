// importing database
const mongoose = require("mongoose");

// user schema
var userSchema = new mongoose.Schema({
    image: {
        type: [Object],
        required: "This field is required"
    },
    name: {
        type: String,
        required: "This field is required"
    },
    linkedin: {
        type: String,
        required: "This field is required"
    },
    twitter: {
        type: String,
        required: "This field is required"
    },
    facebook: {
        type: String,
        required: "This field is required"
    },
    instagram: {
        type: String,
        required: "This field is required"
    },
    pinterest: {
        type: String,
        required: "This field is required"
    },
    gmail: {
        type: String,
        required: "This field is required"
    },
    footer_description: {
        type: String,
        required: "This field is required"
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

mongoose.model("user", userSchema);