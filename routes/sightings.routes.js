const express = require("express");
const { postSighting } = require("../controllers/sightings.controller");

const sightingsRouter = express.Router();

sightingsRouter.route("/:user_id").post(postSighting);

module.exports = sightingsRouter;
