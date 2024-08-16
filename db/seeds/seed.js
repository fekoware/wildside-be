const format = require("pg-format");
const db = require("../connection.js");

const seed = ({ sightings, users }) => {
  return (
    db
      // Clear out tables
      .query("DROP TABLE IF EXISTS users")
      .then(() => {
        return db.query("DROP TABLE IF EXISTS sightings");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS favourite_wildlife");
      })
      // Re-create tables
      .then(() => {
        return createUsers();
      })
      // Populate tables
      .then(() => {
        return insertUsers();
      })
  );
};

function createUsers() {
  // -----Password ticket raised https://trello.com/c/XsiShEew/68-password-security-spike-------
  return db.query(`CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(40) NOT NULL,
        password VARCHAR(40) NOT NULL,
        email VARCHAR(100) NOT NULL
        )`);
}

function insertUsers() {
  return;
}

module.exports = seed;

// my_sightings INT REFERENCES sightings(sighting_id),
// favourite_wildlife INT REFERENCES favourite_wildlife(wildlife_id)
