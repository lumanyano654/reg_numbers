module.exports = function regNumbers(pool) {
  
  async function addRegNumber(town) {

    console.log({town});
    
    if(town.trim() == "") return 1;
    town = town.toUpperCase();
    var lengthString = town.substring(0, 2);
    var registration = /C[ALY]\s\d{3}-\d{3}$|[\d\s]{4,10}$/.test(town);
    
    if (registration) {
      var duplicate = await pool.query(
        "select reg_numbers from registration_numbers where reg_numbers = $1",
        [town]
      );
  
      if (town.length <= 10 ) {
        if (duplicate.rowCount === 0) {
          var townId = await pool.query(
            "select id from towns where town_id = $1",
            [lengthString]
          );
  
          const townIds = townId.rows[0].id;
  
          var town_id = await pool.query(
            "INSERT INTO registration_numbers(reg_numbers,town_code)values($1, $2)",
            [town, townIds]
          );
        } else {
          return 4;
        }
      } else {
        return 3;
      } 
      return true;
    } else {
      return 2;
    }
  }

  async function getRegNumbers() {
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
    getRegNumbers,
    addRegNumber,
    reset,
    filter,
    checkDuplicates,
  };
};
