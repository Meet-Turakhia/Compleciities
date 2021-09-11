// dependencies and variables
var globalPercentage;
const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Marker = mongoose.model("markers");
const Brief = mongoose.model("briefs");
const multer = require('multer');
var fs = require('fs');
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


// middlewares
function progress_middleware(req, res, next) {
    let count = 0;
    let progress = 0;
    const file_size = req.headers["content-length"];
    // set event listener
    req.on("data", (chunk) => {
        progress += chunk.length;
        globalPercentage = (progress / file_size) * 100;
    });
    req.percent = globalPercentage;
    if (globalPercentage == 100) {
        count += 1;
        if (count == 2){
            globalPercentage = 0;
        }
    }
    // invoke next middleware
    next();
}


// routes
router.get("/", (req, res) => {
    Marker.find((markerErr, markerDocs) => {
        if (!markerErr) {
            Brief.find((briefErr, briefDocs) => {
                if (!briefErr){
                    res.render("layouts/index", {
                        markerData: JSON.stringify(markerDocs),
                        briefData: JSON.stringify(briefDocs),
                    });
                }else{
                    console.log("Following error occured while retrieving the marker brief data:" + briefErr);
                }
            });
        } else {
            console.log("Following error occured while retrieving the marker data:" + markerErr);
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

router.post("/add-brief", progress_middleware, upload.array("media", 10), (req, res, next) => {
    addBrief(req, res);
});

router.post("/edit-brief/:newMedia", progress_middleware, upload.array("media", 10), (req, res, next) => {
    editBrief(req.params.newMedia, req, res);
});

router.post("/delete-brief", progress_middleware, upload.array("media", 10), (req, res, next) => {
    deleteBrief(req, res);
});

router.get("/get-upload-progress", progress_middleware, (req, res, next) => {
    res.send({
        percentage: req.percent,
    });
});


// functions
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

function editBrief(newMedia, req, res) {
    if (newMedia == "on"){
        var pathArray = req.body.current_media.split(",");
        pathArray.forEach(path => {
            fs.unlinkSync(path);
        });
        req.body.media = req.files;
    }
    Brief.findOneAndUpdate({ _id: req.body.brief_id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect("/");
        } else {
            console.log("Following error occured while updating the brief data: " + err);
        }
    });
}

function deleteBrief(req, res) {
    var pathArray = req.body.current_media.split(",");
    pathArray.forEach(path => {
        fs.unlinkSync(path);
    });
    Brief.findByIdAndRemove(req.body.brief_id, (err, doc) => {
        if (!err) {
            res.redirect("/");
        }
        else {
            console.log("Following error occured while deleting the brief data: " + err);
        }
    });
}

module.exports = router;
