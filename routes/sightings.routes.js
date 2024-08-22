const express = require("express");
const { postSighting, getSightingById, getSightingsByUserAndCoordinates } = require("../controllers/sightings.controller");

const sightingsRouter = express.Router();

sightingsRouter
.route("/user/:user_id")
.post(postSighting)
.get(getSightingsByUserAndCoordinates)

sightingsRouter
.route("/:sighting_id")
.get(getSightingById);

module.exports = sightingsRouter;
