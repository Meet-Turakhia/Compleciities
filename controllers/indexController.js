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
            console.log("Following error occured while retrieving the marker data:" + err);
        }
    });
});

router.post("/", (req, res) => {
    addMarker(req, res);
});

router.post("/edit-marker", (req, res) => {
    editMarker(req, res);
});

router.post("/delete-marker", (req, res) => {
    deleteMarker(req, res);
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

function editMarker(req, res) {
    Marker.findOneAndUpdate({ _id: req.body.markerId }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect("/");
        } else {
            console.log("Following error occured while updating the marker data: " + err);
        }
    });
}

function deleteMarker(req, res) {
    Marker.findByIdAndRemove(req.body.markerId, (err, doc) => {
        if (!err) {
            res.redirect("/");
        }
        else {
            console.log("Following error occured while deleting the marker data: " + err);
        }
    });
}

module.exports = router;
