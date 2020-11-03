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


let app = express();

const regNumber = regNumberFact(pool)

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

  await regNumber.setlocation(town)

  const setlocation = await regNumber.getlocation();
  console.log(setlocation)
  res.render("index", {
    reg_id: setlocation
  })
})

app.get('/reset', function (req, res) {

  res.render('index')
})

app.get("/filter", function (req, res) {


  res.render("index");
});



let PORT = process.env.PORT || 3001;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});