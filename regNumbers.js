module.exports = function regNumbers(pool){


async function setlocation(town){

    const showTown = await pool.query('select reg_id from registration_numbers where reg_id =$1',[town]);

    if (showTown.rowCount == 0){
        await pool.query('insert into registration_numbers (reg_id) values($1)', [town])
    }
}

async function getlocation(){
    const showTown = await pool.query("select reg_id from registration_numbers")
      return showTown.rows;
  }
  

return{
    getlocation,
    setlocation
}
}