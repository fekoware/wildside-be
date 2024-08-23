express = require("express");

const {
  getWIldlifeByUserId,
  addWildlifeToFavouritesByUserId,
  deleteWildlifeFromFavouritesByUserId
} = require("../controllers/favourite-wildlife.controller");

const favouriteWildlifeRouter = express.Router();

favouriteWildlifeRouter
  .route("/users/:user_id")
  .get(getWIldlifeByUserId)
  
favouriteWildlifeRouter.route("/:sighting_id/users/:user_id").post(addWildlifeToFavouritesByUserId);





module.exports = favouriteWildlifeRouter;
