// initializing and connecting with mongodb database

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Complecities", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) { console.log("MongoDB connection Succeeded.") }
    else { console.log("Error in MongoDB connection : " + err) }
});

require("./marker.model");
require("./category.model");
require("./categoryrelation.model");
require("./brief.model");
require("./user.model");