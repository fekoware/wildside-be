const { fetchWildlifeByUserId, insertWildlifeToFavouriteByUserId } = require("../models/favourite-wildlife.model");

exports.getWIldlifeByUserId = (request, response, next) => {
  const { user_id } = request.params;

  fetchWildlifeByUserId(user_id)
    .then((wildlife) => {
      response.status(200).send({ wildlife });
    })
    .catch(next);
};

exports.addWildlifeToFavouritesByUserId = (request, response, next) => {
  const { user_id, sighting_id } = request.params;

  insertWildlifeToFavouriteByUserId(user_id, sighting_id).then((favourite) => {
    console.log(favourite, "in controller")
    return response.status(201).send({favourite})
  }).catch(next);
};
