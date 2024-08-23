const db = require("../db/connection");

exports.fetchWildlifeByUserId = (user_id) => {
  return db
    .query(
      `SELECT * FROM sightings
         INNER JOIN x_favourite_wildlife
         ON sightings.sighting_id = x_favourite_wildlife.sighting_id
        WHERE x_favourite_wildlife.user_id = $1;`,
      [user_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertWildlifeToFavouriteByUserId = (user_id, sighting_id) => {
  return db
    .query(
      `INSERT into x_favourite_wildlife (user_id, sighting_id) VALUES ($1, $2) RETURNING *`,
      [user_id, sighting_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.removeWildlifeFromFavouritesByUserId = (user_id, sighting_id) => {
  return db
    .query(
      `DELETE FROM  x_favourite_wildlife WHERE user_id = $1 AND sighting_id = $2 RETURNING *`,
      [user_id, sighting_id]
    )
    .then((result) => {
        return "wildlife sigthing deleted"
    });
};
