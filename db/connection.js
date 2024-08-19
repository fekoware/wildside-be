const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
const envPath = `${__dirname}/../.env.${ENV}`;

require("dotenv").config({ path: envPath });

if (!process.env.PGDATABASE) {
  throw new Error("no pg database configured");
}

module.exports = new Pool();
