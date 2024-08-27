const express = require("express");
const {
  postUser,
  getUsers,
  getUserByUsername,
  postLoginAttempt,
} = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter
    .route("/")
    .get(getUsers)
    .post(postUser);

usersRouter
    .route("/:username")
    .get(getUserByUsername);

usersRouter
    .route("/login")
    .post(postLoginAttempt);

module.exports = usersRouter;
