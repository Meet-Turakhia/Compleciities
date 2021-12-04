// dependencies and variables

var globalPercentage;
var globalPassword = "fd12091997";
const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Marker = mongoose.model("markers");
const Category = mongoose.model("categories");
const CategoryRelation = mongoose.model("categoryrelations");
const Brief = mongoose.model("briefs");
const User = mongoose.model("user");
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
const upload = multer({ storage: storage });


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
        if (count == 2) {
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
            Category.find((categoryErr, categoryDocs) => {
                if (!categoryErr) {
                    CategoryRelation.find((categoryrelationErr, categoryrelationDocs) => {
                        if (!categoryrelationErr) {
                            Brief.find((briefErr, briefDocs) => {
                                if (!briefErr) {
                                    User.find((userErr, userDocs) => {
                                        if (!userErr) {
                                            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                                            res.render("layouts/index", {
                                                markerData: JSON.stringify(markerDocs),
                                                categoryData: JSON.stringify(categoryDocs),
                                                categoryrelationData: JSON.stringify(categoryrelationDocs),
                                                briefData: JSON.stringify(briefDocs),
                                                userData: JSON.stringify(userDocs),
                                                showSettings: false,
                                                pageUrl: fullUrl
                                            });
                                        } else {
                                            console.log("Following error occured while retrieving the user data:" + userErr);
                                        }
                                    })
                                } else {
                                    console.log("Following error occured while retrieving the marker brief data:" + briefErr);
                                }
                            });
                        } else {
                            console.log("Following error occured while retrieving the category relation data:" + categoryrelationErr);
                        }
                    });
                } else {
                    console.log("Following error occured while retrieving the category data:" + categoryErr);
                }
            })
        } else {
            console.log("Following error occured while retrieving the marker data:" + markerErr);
        }
    });
});


router.get("/admin/:password", (req, res) => {
    if (req.params.password == globalPassword) {
        showSettings = true;
    } else {
        showSettings = false;
    }
    Marker.find((markerErr, markerDocs) => {
        if (!markerErr) {
            Category.find((categoryErr, categoryDocs) => {
                if (!categoryErr) {
                    CategoryRelation.find((categoryrelationErr, categoryrelationDocs) => {
                        if (!categoryrelationErr) {
                            Brief.find((briefErr, briefDocs) => {
                                if (!briefErr) {
                                    User.find((userErr, userDocs) => {
                                        if (!userErr) {
                                            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                                            res.render("layouts/index", {
                                                markerData: JSON.stringify(markerDocs),
                                                categoryData: JSON.stringify(categoryDocs),
                                                categoryrelationData: JSON.stringify(categoryrelationDocs),
                                                briefData: JSON.stringify(briefDocs),
                                                userData: JSON.stringify(userDocs),
                                                showSettings: showSettings,
                                                pageUrl: fullUrl
                                            });
                                        } else {
                                            console.log("Following error occured while retrieving the user data:" + userErr);
                                        }
                                    })
                                } else {
                                    console.log("Following error occured while retrieving the marker brief data:" + briefErr);
                                }
                            });
                        } else {
                            console.log("Following error occured while retrieving the category relation data:" + categoryrelationErr);
                        }
                    });
                } else {
                    console.log("Following error occured while retrieving the category data:" + categoryErr);
                }
            })
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

router.post("/add-user-data", progress_middleware, upload.single("userImage"), (req, res, next) => {
    addUserData(req, res);
});

router.post("/edit-user-data/:newUserImage", progress_middleware, upload.single("userImage"), (req, res, next) => {
    editUserData(req.params.newUserImage, req, res);
});

router.post("/add-category", (req, res) => {
    addCategory(req, res);
});

router.post("/delete-category", (req, res) => {
    deleteCategory(req, res);
});

// functions

function addMarker(req, res) {
    var marker = new Marker();
    var categoryrelation = new CategoryRelation();
    marker.latitude = req.body.latitude;
    marker.longitude = req.body.longitude;
    marker.zoom_level = req.body.zoom_level;
    marker.title = req.body.title;
    marker.description = req.body.description;
    marker.save((err, doc) => {
        if (!err) {
            if (typeof (req.body.categoryDropdown) == "object") {
                var allRelations = [];
                req.body.categoryDropdown.forEach(category => {
                    var relation = new Object();
                    relation.marker_title = req.body.title;
                    relation.category_id = category;
                    allRelations.push(relation);
                });
                categoryrelation.collection.insertMany(allRelations, (err, docs) => {
                    if (!err) {
                        res.redirect("/admin/" + globalPassword);
                    } else {
                        console.log("Following error occured while adding relation in database: " + err);
                    }
                });
            } else {
                categoryrelation.marker_title = req.body.title;
                categoryrelation.category_id = req.body.categoryDropdown;
                categoryrelation.save((err, doc) => {
                    if (!err) {
                        res.redirect("/admin/" + globalPassword);
                    } else {
                        console.log("Following error occured while adding relation in database: " + err);
                    }
                });
            }
        }
        else {
            console.log("Following error occured while adding new marker in database: " + err);
        }
    });
}


function editMarker(req, res) {
    Marker.findOneAndUpdate({ _id: req.body.markerId }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            CategoryRelation.deleteMany({ marker_title: req.body.title }, (categoryrelationDeleteErr, categoryrelationDeleteDoc) => {
                if (!categoryrelationDeleteErr) {
                    var categoryrelation = new CategoryRelation();
                    if (typeof (req.body.categoryDropdown) == "object") {
                        var allRelations = [];
                        req.body.categoryDropdown.forEach(category => {
                            var relation = new Object();
                            relation.marker_title = req.body.title;
                            relation.category_id = category;
                            allRelations.push(relation);
                        });
                        categoryrelation.collection.insertMany(allRelations, (err, docs) => {
                            if (!err) {
                                res.redirect("/admin/" + globalPassword);
                            } else {
                                console.log("Following error occured while adding relation in database: " + err);
                            }
                        });
                    } else {
                        categoryrelation.marker_title = req.body.title;
                        categoryrelation.category_id = req.body.categoryDropdown;
                        categoryrelation.save((err, doc) => {
                            if (!err) {
                                res.redirect("/admin/" + globalPassword);
                            } else {
                                console.log("Following error occured while adding relation in database: " + err);
                            }
                        });
                    }
                } else {
                    console.log("Following error occured while deleting the categoryrelation data before updating: " + categoryrelationDeleteErr);
                }
            });
        } else {
            console.log("Following error occured while updating the marker data: " + err);
        }
    });
    Brief.findOne({ marker_id: req.body.markerId }, (err, doc) => {
        if (!err) {
            if (doc != null) {
                doc.marker_title = req.body.title;
                doc.save();
            }
        } else {
            console.log("Following error occured while updating the marker data in Brief Collection: " + err);
        }
    });
}


function deleteMarker(req, res) {
    Marker.findByIdAndRemove(req.body.markerId, (markerErr, markerDoc) => {
        if (!markerErr) {
            Brief.findOne({ marker_id: req.body.markerId }, (briefErr, briefDoc) => {
                if (briefDoc != null) {
                    if (!briefErr) {
                        var allMedia = briefDoc.media;
                        for (let [key, value] of Object.entries(allMedia)) {
                            fs.unlinkSync(value.path);
                        }
                    } else {
                        console.log("Following error occured while deleting the brief media of this respective marker: " + briefErr);
                    }
                }
            });
            Brief.findOneAndRemove({ marker_id: req.body.markerId }, (briefErr, briefDoc) => {
                if (!briefErr) {
                    res.redirect("/admin/" + globalPassword);
                } else {
                    console.log("Following error occured while deleting the brief data of this respective marker: " + briefErr);
                }
            });
        }
        else {
            console.log("Following error occured while deleting the marker data: " + markerErr);
        }
    });
}


function addBrief(req, res) {
    var brief = new Brief();
    brief.marker_id = req.body.marker_id;
    brief.marker_title = req.body.marker_title;
    brief.title = req.body.title;
    brief.brief = req.body.brief;
    brief.media = req.files;
    brief.save((err, doc) => {
        if (!err) {
            res.redirect("/admin/" + globalPassword);
        }
        else {
            console.log("Following error occured while adding new brief in database: " + err);
        }
    });
}


function editBrief(newMedia, req, res) {
    if (newMedia == "on") {
        var pathArray = req.body.current_media.split(",");
        pathArray.forEach(path => {
            fs.unlinkSync(path);
        });
        req.body.media = req.files;
    }
    Brief.findOneAndUpdate({ _id: req.body.brief_id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect("/admin/" + globalPassword);
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
            res.redirect("/admin/" + globalPassword);
        }
        else {
            console.log("Following error occured while deleting the brief data: " + err);
        }
    });
}

function addUserData(req, res) {
    var user = new User();
    user.image = req.file;
    user.name = req.body.name;
    user.linkedin = req.body.linkedin;
    user.twitter = req.body.twitter;
    user.facebook = req.body.facebook;
    user.instagram = req.body.instagram;
    user.pinterest = req.body.pinterest;
    user.gmail = req.body.gmail;
    user.footer_description = req.body.footer_description;
    user.save((err, doc) => {
        if (!err) {
            res.redirect("/admin/" + globalPassword);
        } else {
            console.log("Following error occured while inserting the user data: " + err)
        }
    });
}


function editUserData(newUserImage, req, res) {
    if (newUserImage == "on") {
        var path = req.body.current_user_image;
        fs.unlinkSync(path);
        req.body.image = req.file;
    }
    User.findOneAndUpdate({ _id: req.body.user_id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect("/admin/" + globalPassword);
        } else {
            console.log("Following error occured while updating the user data: " + err);
        }
    });
}

function addCategory(req, res) {
    var category = new Category();
    category.category = req.body.category;
    category.save((err, doc) => {
        if (!err) {
            res.redirect("/admin/" + globalPassword);
        } else {
            console.log("Following error occured while adding a new category: " + err);
        }
    });
}

function deleteCategory(req, res) {
    Category.findByIdAndRemove(req.body.categoryId, (err, doc) => {
        if (!err) {
            res.redirect("/admin/" + globalPassword);
        } else {
            console.log("Following error occured while deleting the category: " + err);
        }
    });
}

module.exports = router;
