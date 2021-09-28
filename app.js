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

// building base
var app = express();

app.use(bodyparser.urlencoded({
    extended: true,
}));
app.use(bodyparser.json());
app.set("views", path.join(__dirname, "/views/"));
app.use(express.static(__dirname + '/views/public'));
app.engine("hbs", exphbs({ extname: "hbs", defaultLayout: false, layoutsDir: __dirname + "/views/layouts/", handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set("view engine", "hbs");

app.listen(3000, () => {
    console.log("Express server started at port: 3000");
});

app.use("/", indexController);
app.use("/brief", briefController);