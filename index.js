let express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
const flash = require('express-flash');
var session = require('express-session')
const regNumberFact = require("./regNumbers")

const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://lumanyano:sanelisiwe@localhost:5432/reg_numbers';

const pool = new Pool({
  connectionString
});

process.env.PORT
process.env.DATABASE_URL

let app = express();

let regNumber = regNumberFact(pool)

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));

app.use(flash());


app.get("/", function (req, res) {


  res.render("index");
});

app.post("/regnumbers", async function (req, res) {
  var town = req.body.reg_input

  var town = town.toUpperCase()

  await regNumber.setlocation(town)

  var checkDuplicates = await regNumber.checkDuplicates(town)

  var getlocation = await regNumber.getlocation();

 


  if (!town){
    req.flash('info', 'enter registration numbers')
  }

  else if (checkDuplicates !== 0) {
    var getlocation = await regNumber.getlocation();
    req.flash("info", "registration number already exists")
  }
  
  else if (!town.startsWith("CA ") || !town.startsWith("CY ") || !town.startsWith("CL ")) {
    req.flash('info', 'enter a valid registration')
  }

  res.render("index", {
    reg_numbers: getlocation
  })
})

app.get("/regnumbers", async function (req, res) {

  var towns = req.query.selectedTowns

  
  console.log(towns);
  
  var filter = await regNumber.filter(towns)
  console.log(filter)

  res.render("index", {
    reg_numbers: filter
  });
});

app.get('/reset', async function (req, res) {
  await regNumber.reset();

  res.redirect('/')
})





let PORT = process.env.PORT || 3001;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});