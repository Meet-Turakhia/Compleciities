// importing database
const mongoose = require("mongoose");

// importing mangoose funtionalities
const Double = require('@mongoosejs/double');

// marker schema
var markerSchema = new mongoose.Schema({
    latitude: {
        type: Double,
        required: "This field is required"
    },
    longitude: {
        type: Double,
        required: "This field is required"
    },
    zoom_level: {
        type: Number,
        required: "This field is required"
    },
    title: {
        type: String,
        required: "This field is required"
    },
    description: {
        type: String,
        required: "This field is required"
    },
});

mongoose.model("markers", markerSchema);