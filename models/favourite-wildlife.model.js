const db = require("../db/connection")

exports.fetchWildlifeByUserId = (user_id) => {


    console.log(user_id, "inside model")

    return db.query(`SELECT * FROM x_favourite_wildlife WHERE user_id = $1;`, [user_id]).then((result) => {
       
        return result.rows
    })
    

}