const db = require("../db/connection");

exports.insertSighting = (newSighting) => {
  return db
    .query(
      `INSERT INTO sightings
    (user_id, uploaded_image, long_position,
    lat_position, common_name, taxon_name, wikipedia_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
      [
        newSighting.user_id,
        newSighting.uploaded_image,
        newSighting.long_position,
        newSighting.lat_position,
        newSighting.common_name,
        newSighting.taxon_name,
        newSighting.wikipedia_url,
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
