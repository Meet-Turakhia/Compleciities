const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Marker = mongoose.model("markers");

router.get("/", (req, res) => {
    Marker.find((err, docs) => {
        if (!err) {
            res.render("layouts/index", {
                markerData: JSON.stringify(docs),
            });
        } else {
            console.log("Error in retrieving Marker Data:" + err);
        }
    });
});

router.post("/", (req, res) => {
    addMarker(req, res);
});

function addMarker(req, res) {
    var marker = new Marker();
    marker.latitude = req.body.latitude;
    marker.longitude = req.body.longitude;
    marker.zoom_level = req.body.zoom_level;
    marker.title = req.body.title;
    marker.description = req.body.description;
    marker.save((err, doc) => {
        if (!err) {
            res.redirect("/");
        }
        else {
            console.log("Following error occured while adding new marker in database: " + err);
        }
    });
}

router.get("/get-marker-data", (req, res) => {
    Marker.find((err, docs) => {
        if (!err) {
            res.send({
                markerData: docs,
            });
        } else {
            console.log("Error in retrieving marker data:" + err);
        }
    });
});

module.exports = router;