express = require("express")

const { getWIldlifeByUserId } = require("../controllers/favourite-wildlife.controller")

const myWildlifeRouter = express.Router()

myWildlifeRouter.route("/users/:user_id").get(getWIldlifeByUserId)


module.exports = myWildlifeRouter
