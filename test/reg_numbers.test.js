const assert = require("assert");
const regNumFact = require("../regNumbers");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://lumanyano:sanelisiwe@localhost:5432/regnumbers_tests";

const pool = new Pool({
  connectionString,
});
const regNumber = regNumFact(pool);
describe("The registration numbers webapp", function () {
  beforeEach(async function () {
    await pool.query("delete from registration_numbers;");
  });

  it("should be able to insert registration numbers", async function () {
    await regNumber.setlocation("CA 123 456");

    const getlocation = await regNumber.getlocation();
    assert.deepEqual(
      [
        {
          reg_numbers: "CA 123 456",
        },
      ],
      getlocation
    );
  });

  it("should be able reset the database", async function () {
    await regNumber.setlocation("CA 123 435");
    await regNumber.setlocation("CA 123 742");
    await regNumber.setlocation("CA 123 678");

    const resetdb = await regNumber.reset();

    assert.equal(undefined, resetdb);
  });

  it("should be able to show if its Cape Town", async function () {
    await regNumber.setlocation("CA 123 678");
    await regNumber.setlocation("CL 123 678");
    await regNumber.setlocation("CY 123 678");

    assert.deepEqual(await regNumber.filter(1), [
      { reg_numbers: "CA 123 678" },
    ]);
  });

  it("should be able to show if its from Bellville", async function () {
    await regNumber.setlocation("CL 123 678");
    await regNumber.setlocation("CL 123 679");
    await regNumber.setlocation("CY 364 498");

    assert.deepEqual(await regNumber.filter(2), [
      { reg_numbers: "CY 364 498" },
    ]);
  });

  it("should be able to show if its from Stellenbosch", async function () {
    await regNumber.setlocation("CL 123 678");
    await regNumber.setlocation("CL 123 679");
    await regNumber.setlocation("CY 364 498");

    assert.deepEqual(await regNumber.filter(3), [
      { reg_numbers: "CL 123 678" },
      { reg_numbers: "CL 123 679" },
    ]);
  });

  it("should be able to show if its does check duplicates", async function () {
    await regNumber.setlocation("CL 123 678");
    await regNumber.setlocation("CL 123 679");
    
    const duplicates = await regNumber.checkDuplicates("CL 123 678");
    assert.equal(1, duplicates);
  });

  after(function () {
    pool.end();
  });
});
