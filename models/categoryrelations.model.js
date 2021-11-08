// importing database
const mongoose = require("mongoose");

// importing mangoose funtionalities
const Double = require('@mongoosejs/double');

// category schema
var categoryrelationsSchema = new mongoose.Schema({
    marker_id: {
        type: String,
        required: "This field is required"
    },
    category_id: {
        type: String,
        required: "This field is required"
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

mongoose.model("categoryrelations", categoryrelationsSchema);