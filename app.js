const express = require("express");
const { sightingsRouter, usersRouter, myWildlifeRouter } = require("./routes");

const app = express();
app.use(express.json());

app.use("/api/sightings", sightingsRouter);
app.use("/api/users", usersRouter);
app.use("/api/mywildlife", myWildlifeRouter );

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
