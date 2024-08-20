const express = require("express");
const { sightingsRouter } = require("./routes");

const app = express();
app.use(express.json());

app.use("/api/sightings", sightingsRouter);

module.exports = app;
