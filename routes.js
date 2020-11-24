module.exports = function regNumbersRoutes(regNumber) {
  async function home(req, res) {
    var reg_numbers = await regNumber.getRegNumbers();
    res.render("index", { reg_numbers });
  }

  async function addedRegistration(req, res) {
    var town = req.body.reg_input;
    town = town.toUpperCase();

    const addRegistration = await regNumber.addRegNumber(town);

    switch (addRegistration) {
      case 1:
        req.flash("info", "Enter registration number");
        break;
      case 2:
        req.flash("info", "Please enter valid registration");
        break;
      case 3:
        req.flash("info", "Your registration must have less characters");
        break;
      case 4:
        req.flash("info", "registration number already exists");
        break;
      default:
        req.flash("success", "successfully entered registration");
    }

    res.redirect("/");
  }

  async function filter(req, res) {
    var towns = req.query.selectedTowns;

    var filter = await regNumber.filter(towns);

    res.render("index", {
      reg_numbers: filter,
    });
  }

  async function reset(req, res) {
    await regNumber.reset();
    req.flash("success", "all data has been successfully cleared");
    res.redirect("/");
  }

  return {
    home,
    addedRegistration,
    filter,
    reset,
  };
};
