const db = require("../db/connection");
const { checkValidNewSighting, checkUserExists } = require("../utils")

exports.insertSighting = (newSighting) => {
  if (!checkValidNewSighting(newSighting)) {
    return Promise.reject({
      status: 400,
      message: "Bad request"
    })
  }
  else if (!(newSighting.long_position >= -180 && newSighting.long_position <= 180) || !(newSighting.lat_position >= -90 && newSighting.lat_position <= 90)) {
    return Promise.reject({
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

exports.selectSightingById = (sighting_id) => {
  if (isNaN(parseInt(sighting_id))) {
    return Promise.reject({
      status: 400,
      message: "Invalid sighting id"
    })
  }
  return db
    .query(
      `SELECT * FROM sightings WHERE sighting_id = $1;`,
      [sighting_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `Sighting not found`,
        });
      } else {
        return result.rows[0];
      }
    });
};

exports.selectSightingsByUserAndCoordinates = (user_id, swlat, swlong, nelat, nelong) => {

  if (!swlat || !swlong || !nelat || !nelong) {
    return Promise.reject({
      status: 400,
      message: "Missing or invalid co-ordinate parameters",
    });
  }

  const swlatNum = parseFloat(swlat);
  const swlongNum = parseFloat(swlong);
  const nelatNum = parseFloat(nelat);
  const nelongNum = parseFloat(nelong);

  if (
    swlatNum < -90 || swlatNum > 90 ||
    nelatNum < -90 || nelatNum > 90 ||
    swlongNum < -180 || swlongNum > 180 ||
    nelongNum < -180 || nelongNum > 180
  ) {
    return Promise.reject({
      status: 400,
      message: "Invalid latitude/longitude range",
    });
  }

  let queryStr = `SELECT * FROM sightings WHERE user_id = $1`;
  const queryParams = [user_id];

  queryStr += ` AND lat_position >= $2 AND lat_position <= $3 AND long_position >= $4 AND long_position <= $5`;
  queryParams.push(swlatNum, nelatNum, swlongNum, nelongNum);

  return db.query(queryStr, queryParams).then((result) => {
    return result.rows;
  });
};
