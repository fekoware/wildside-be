const db = require("../db/connection");
const { checkValidNewSighting } = require("../utils")

exports.insertSighting = (newSighting) => {
  if (!checkValidNewSighting(newSighting)) {
    return Promise.reject ({
      status: 400,
      message: "Bad request"
    })
  }
  else if (!(newSighting.long_position >= -180 && newSighting.long_position <= 180) || !(newSighting.lat_position >= -90 && newSighting.lat_position <= 90)) {
    return Promise.reject ({
      status: 416,
      message: "Range error of latitude (-90, +90) or longitude (-180, 180)"
    })
  }
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
