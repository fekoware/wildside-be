const {insertUser} = require("../models/users.model")

exports.postUser = (request, response, next) => {
    const user = request.body;
    insertUser(user).then((newUser) => {
    const userResponse = {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
      };
    response.status(201).send({ user: userResponse })
  })
  .catch(next)
  }
