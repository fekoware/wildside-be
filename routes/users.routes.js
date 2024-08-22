const express = require("express");
const {postUser, getUsers, getUserByUsername} = require("../controllers/users.controller")

const usersRouter = express.Router();

usersRouter
.route("/")
.post(postUser);

usersRouter
.route("/")
.get(getUsers);

usersRouter
.route('/:username')
.get(getUserByUsername);

module.exports = usersRouter;