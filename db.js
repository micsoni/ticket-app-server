const Sequelize = require("sequelize");

// in case I want to deploy it to heroku
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:secret@localhost:5432/postgres";

const db = new Sequelize(databaseUrl);

db.sync({ force: false })
  .then(() => console.log("Database connect")) // confirm database is working
  .catch(console.error);

module.exports = db;
