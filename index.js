let express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
const flash = require("express-flash");
var session = require("express-session");
const regNumberFact = require("./regNumbers");

const pg = require("pg");
const Pool = pg.Pool;

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://lumanyano:sanelisiwe@localhost:5432/reg_numbers";

const pool = new Pool({
  connectionString,
});

process.env.PORT;
process.env.DATABASE_URL;

let app = express();

let regNumber = regNumberFact(pool);

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(
  session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.get("/", async function (req, res) {
  var reg_numbers = await regNumber.getRegNumbers();
  res.render("index", {reg_numbers});
});

app.post("/regnumbers", async function (req, res) {
  var town = req.body.reg_input;
  var town = town.toUpperCase();
  var checkDuplicates = await regNumber.checkDuplicates(town);

  if (town.length > 10) {
    req.flash("info", "Your registration must have less characters");
  } else if (checkDuplicates !== 0) {
    req.flash("info", "registration number already exists");
  } else if (town == "") {
    req.flash("info", "Enter registration number");
  } else if (town) {
    await regNumber.addRegNumber(town);
  } else if (
    !town.startsWith("1 ") ||
    !town.startsWith("2 ") ||
    !town.startsWith("3 ")
  ) {
    req.flash("info", "This is not a registration number");
  }

  res.redirect("/");
  
});

app.get("/regnumbers", async function (req, res) {
  var towns = req.query.selectedTowns;

  console.log(towns);

  var filter = await regNumber.filter(towns);
  console.log(filter);

  res.render("index", {
    reg_numbers: filter,
  });
});

app.get("/reset", async function (req, res) {
  await regNumber.reset();
  req.flash("success", "all data has been successfully cleared");
  res.redirect("/");
});

let PORT = process.env.PORT || 3001;

app.listen(PORT, function () {
  console.log("App starting on port", PORT);
});
