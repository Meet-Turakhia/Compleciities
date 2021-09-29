// dependencies and variables

const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Marker = mongoose.model("markers");
const Brief = mongoose.model("briefs");
const User = mongoose.model("user");

// routes

router.get("/:markerTitle", (req, res) => {
    markerTitle = req.params.markerTitle.replace("-", " ");

    Brief.findOne({ marker_title: markerTitle }, (briefErr, briefDocs) => {
        if (!briefErr) {
            User.find((userErr, userDocs) => {
                if (briefDocs != null) {
                    tempDate = briefDocs.created_at.toString().split(" ");
                    day = tempDate[2];
                    month = tempDate[1];
                    year = tempDate[3];
                    date = day + " " + month + " " + year;
                    userDocs = userDocs[0];
                    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                    if (!userErr) {
                        res.render("layouts/brief", {
                            briefData: briefDocs,
                            userData: userDocs,
                            briefDate: date,
                            pageUrl: fullUrl
                        });
                    } else {
                        console.log("Following error occured while retrieving the user data: " + userErr);
                    }
                } else {
                    res.send("The brief of this marker is not written yet, visit sometimes later, till then keep exploring other markers, thank you!");
                }
            });
        } else {
            console.log("Following error occured while retrieving the brief data: " + briefErr);
        }
    });
});

module.exports = router;