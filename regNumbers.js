module.exports = function regNumbers(pool) {
  
  async function setlocation(town) {
    town = town.toUpperCase();

    var duplicate = await pool.query(
      "select reg_numbers from registration_numbers where reg_numbers = $1",
      [town]
    );

    if (town.length <= 10 ) {
      if (duplicate.rowCount === 0) {
        var substring = town.substring(0, 2);

        var townId = await pool.query(
          "select id from towns where town_id = $1",
          [substring]
        );

        const townIds = townId.rows[0].id;

        var town_id = await pool.query(
          "INSERT INTO registration_numbers(reg_numbers,town_code)values($1, $2)",
          [town, townIds]
        );
      }
    }
  }

  async function getlocation() {
    const showTown = await pool.query(
      "select reg_numbers from registration_numbers"
    );
    return showTown.rows;
  }

  async function reset() {
    await pool.query("delete from registration_numbers");
  }

  async function filter(id) {
    if (id == "ALL") {
      const all = await pool.query(
        "select reg_numbers from registration_numbers"
      );
      return all.rows;
    } else {
      const eachTown = await pool.query(
        "select reg_numbers from registration_numbers where town_code = $1",
        [parseInt(id)]
      );
      return eachTown.rows;
    }
  }

  async function checkDuplicates(town) {
    const checkDuplicates = await pool.query(
      "select reg_numbers from registration_numbers where reg_numbers = $1",
      [town]
    );
  

    return checkDuplicates.rowCount;
  }

  return {
    getlocation,
    setlocation,
    reset,
    filter,
    checkDuplicates,
  };
};
