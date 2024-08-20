const { insertSighting } = require("../models/sightings.model");

exports.postSighting = (request, response, next) => {
  const postSighting = request.body;
  postSighting.user_id = request.params.user_id;

  insertSighting(postSighting).then((newSighting) => {
    response.status(201).send({ newSighting })
  })
  .catch(next) 
  }
