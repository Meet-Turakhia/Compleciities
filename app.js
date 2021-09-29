// importing database
require("./models/database");

// initializing dependencies
const bodyparser = require("body-parser");
const express = require("express");
const exphbs = require("express-handlebars");
const Handlebars = require('handlebars');
const path = require("path");
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const indexController = require("./controllers/indexController");
const briefController = require("./controllers/briefController");
const { dirname } = require("path");
const { options } = require("./controllers/indexController");

// building base
var app = express();

const hbs = exphbs.create({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: __dirname + "/views/layouts/",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        isVideo: function (mimetype, options) {
            mediaType = mimetype.split("/")[0];
            if (mediaType == "video") {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        getFilename: function(filename, options){
            justName = path.parse(filename).name;
            return options.fn({ justName: justName });
        }
    }
});

app.use(bodyparser.urlencoded({
    extended: true,
}));
app.use(bodyparser.json());
app.set("views", path.join(__dirname, "/views/"));
app.use(express.static(__dirname + '/views/public'));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.listen(3000, () => {
    console.log("Express server started at port: 3000");
});

app.use("/", indexController);
app.use("/brief", briefController);