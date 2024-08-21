const express = require("express");
const {postUser} = require("../controllers/users.controller")

const usersRouter = express.Router();

usersRouter.route("/").post(postUser);

module.exports = usersRouter;