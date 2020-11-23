let express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
const flash = require("express-flash");
var session = require("express-session");
const regNumberFact = require("./regNumbers");
const regNumberRoutesFile = require("./routes")
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

const regNumber = regNumberFact(pool);
const regNumbrRoutes = regNumberRoutesFile(regNumber);

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

app.get("/",regNumbrRoutes.home);

app.post("/regnumbers",regNumbrRoutes.addedRegistration);

app.get("/regnumbers",regNumbrRoutes.filter);

app.get("/reset",regNumbrRoutes.reset);

let PORT = process.env.PORT || 3001;

app.listen(PORT, function () {
  console.log("App starting on port", PORT);
});
