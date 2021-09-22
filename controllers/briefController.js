// dependencies and variables

const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Marker = mongoose.model("markers");
const Brief = mongoose.model("briefs");

// routes

router.get("/", (req, res) => {
    res.render("layouts/brief");
});

module.exports = router;