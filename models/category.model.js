// importing database
const mongoose = require("mongoose");

// importing mangoose funtionalities
const Double = require('@mongoosejs/double');

// category schema
var categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: "This field is required"
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

mongoose.model("categories", categorySchema);