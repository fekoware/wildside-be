const { insertSighting, selectSightingById, selectSightingsByUserAndCoordinates } = require("../models/sightings.model");

exports.postSighting = (request, response, next) => {
  const postSighting = request.body;
  postSighting.user_id = request.params.user_id;

  insertSighting(postSighting).then((newSighting) => {
    response.status(201).send({ newSighting })
  })
  .catch(next) 
  }


  exports.getSightingById = (request, response, next) => {
    const {sighting_id} = request.params;
    selectSightingById(sighting_id).then((sighting) => {
      response.status(200).send({ sighting })
    })
    .catch(next) 
    }

    exports.getSightingsByUserAndCoordinates = (request, response, next) => {
      const { user_id } = request.params;
      const { swlat, swlong, nelat, nelong } = request.query;
    
      selectSightingsByUserAndCoordinates(user_id, swlat, swlong, nelat, nelong)
        .then((sightings) => {
          if (sightings.length === 0) {
            return Promise.reject({
              status: 404,
              message: "No sightings found for the given user and coordinates",
            });
          }
          response.status(200).send({ sightings });
        })
        .catch(next);
    };
    