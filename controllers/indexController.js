const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Marker = mongoose.model("markers");
const Brief = mongoose.model("briefs");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './views/public/uploads/');
    },
    filename: function (req, file, cb) {
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var time = today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
        cb(null, date + "_" + time + "_" + file.originalname);
    }
})
const upload = multer({ storage: storage});

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

router.post("/add-brief",upload.array("media", 10), (req, res, next) => {
    addBrief(req, res);
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

function addBrief(req, res) {
    var brief = new Brief();
    brief.marker_id = req.body.marker_id;
    brief.title = req.body.title;
    brief.brief = req.body.brief; 
    brief.media = req.files;
    brief.save((err, doc) => {
        if (!err) {
            res.redirect("/");
        }
        else {
            console.log("Following error occured while adding new brief in database: " + err);
        }
    });
}

module.exports = router;
