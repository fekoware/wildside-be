const db = require("../db/connection")

exports.fetchWildlifeByUserId = (user_id) => {


    console.log(user_id, "inside model")

    return db.query(`SELECT * FROM sightings
         INNER JOIN x_favourite_wildlife
         ON sightings.sighting_id = x_favourite_wildlife.sighting_id
        WHERE x_favourite_wildlife.user_id = $1;`, [user_id]).then((result) => {
         
        return result.rows
    })
    

}