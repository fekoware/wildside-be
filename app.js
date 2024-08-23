const express = require("express");

const { sightingsRouter, usersRouter, favouriteWildlifeRouter } = require("./routes");


const { sightingsRouter, usersRouter } = require("./routes");
const { getEndpoints } = require("./controllers/sightings.controller")


const app = express();
app.use(express.json());

app.use("/api/sightings", sightingsRouter);
app.use("/api/users", usersRouter);

app.use("/api/mywildlife", favouriteWildlifeRouter );



app.get("/api", getEndpoints)



app.all('*', (request, response, next) => {
    response.status(404).send({message: 'path not found'})
})

app.use((error, request, response, next) => {
    if (error.code === '22P02') {
        response.status(400).send({message: 'invalid id type'})
    }
    else if (error.code === '23503') {
        response.status(404).send({message: 'User not found'})
    }
    else{
        next(error)
    }
})

app.use((error, request, response, next) => {
   if (error.status && error.message) {
       response.status(error.status).send({ message: error.message });
   } else {
       next(error);
   }
})


module.exports = app;
