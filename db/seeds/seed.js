const format = require("pg-format");
const db = require("../connection.js");

const seed = ({ sightings, users, favouriteWildlife }) => {
  return (
    db
      // Clear out tables
      .query("DROP TABLE IF EXISTS x_favourite_wildlife")
      .then(() => {
        return db.query("DROP TABLE IF EXISTS sightings");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS users");
      })
      // Re-create tables
      .then(() => {
        return createUsers();
      })
      .then(() => {
        return createSightings();
      })
      .then(() => {
        return createXFavouriteWildlife();
      })
      // Populate tables
      .then(() => {
        return insertUsers(users);
      })
      .then(() => {
        return insertSightings(sightings);
      })
      .then(() => {
        return insertXFavouriteWildlife(favouriteWildlife);
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

function createSightings() {
  return db.query(`CREATE TABLE sightings (
    sighting_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) NOT NULL,
    uploaded_image VARCHAR(255) NOT NULL,
    sighting_date DATE NOT NULL, 
    long_position FLOAT NOT NULL,
    lat_position FLOAT NOT NULL,
    common_name VARCHAR(40) NOT NULL,
    taxon_name VARCHAR(100) NOT NULL,
    wikipedia_url VARCHAR(255)
    )`);
}

function createXFavouriteWildlife() {
  return db.query(`
  CREATE TABLE x_favourite_wildlife (
    unique_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) NOT NULL,
    sighting_id INT REFERENCES sightings(sighting_id) NOT NULL
  )`);
}

function insertUsers(users) {
  const nestedUsers = users.map((user) => {
    return [user.username, user.password, user.email];
  });
  return db.query(
    format(
      `INSERT INTO users 
  (username, password, email)
  VALUES %L RETURNING *`,
      nestedUsers
    )
  );
}

function insertSightings(sightings) {
  const nestedSightings = sightings.map((sighting) => {
    return [
      sighting.user_id,
      sighting.uploaded_image,
      sighting.sighting_date,
      sighting.long_position,
      sighting.lat_position,
      sighting.common_name,
      sighting.taxon_name,
      sighting.wikipedia_url,
    ];
  });
  return db.query(
    format(
      `INSERT INTO sightings (user_id, uploaded_image, sighting_date, long_position, lat_position, common_name, taxon_name, wikipedia_url)
  VALUES %L RETURNING *`,
      nestedSightings
    )
  );
}

function insertXFavouriteWildlife(favouriteWildlife) {
  const nestedFavouriteWildlife = favouriteWildlife.map((wildlife) => {
    return [wildlife.user_id, wildlife.sighting_id];
  });
  return db.query(
    format(
      `INSERT INTO x_favourite_wildlife (user_id, sighting_id) VALUES %L RETURNING *`,
      nestedFavouriteWildlife
    )
  );
}

module.exports = seed;
