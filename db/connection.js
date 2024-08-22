const { Pool } = require("pg");
require("dotenv").config({ path: envPath });

const ENV = process.env.NODE_ENV || "development";

const envPath = `${__dirname}/../.env.${ENV}`;

const config = {};

if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}



if (!process.env.PGDATABASE) {
  throw new Error("no pg database configured");
}

module.exports = new Pool();
