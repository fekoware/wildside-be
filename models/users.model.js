const db = require("../db/connection");
const { checkUserExists } = require("../utils");

exports.insertUser = (newUser) => {
  if (!newUser.username || !newUser.password || !newUser.email) {
    return Promise.reject({
      status: 400,
      message: "All fields are required (username, password, email)",
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newUser.email)) {
    return Promise.reject({
      status: 400,
      message: "Invalid email format",
    });
  }
  if (newUser.password.length < 8) {
    return Promise.reject({
      status: 400,
      message: "Password must be at least 8 characters long",
    });
  }
  return checkUserExists(newUser.username, newUser.email).then((conflicts) => {
    if (conflicts.username && conflicts.email) {
      return Promise.reject({
        status: 400,
        message: "User already exists",
      });
    } else if (conflicts.username) {
      return Promise.reject({
        status: 400,
        message: "Username already exists",
      });
    } else if (conflicts.email) {
      return Promise.reject({
        status: 400,
        message: "Email already exists",
      });
    } else {
      return db
        .query(
          `INSERT INTO users
                (username, password, email)
                VALUES ($1, $2, $3)
                RETURNING *`,
          [newUser.username, newUser.password, newUser.email]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    }
  });
};

exports.selectUsers = () => {
  return db
    .query("SELECT user_id, username, email FROM users;")
    .then((result) => {
      return result.rows;
    });
};

exports.selectUserByUsername = (username) => {
  return db
    .query(
      `SELECT user_id, username, email 
             FROM users 
             WHERE username = $1`,
      [username]
    )
    .then(({ rows }) => {
      return rows[0] || null;
    });
};

exports.attemptLogin = (loginAttempt) => {
  if (!loginAttempt.usernameOrEmail || !loginAttempt.password) {
    return Promise.reject({
      status: 400,
      message: "All fields are required (usernameOrEmail, password)",
    });
  }

  const usernameOrEmail = /@/.test(loginAttempt.usernameOrEmail)
    ? "email"
    : "username";

  const obscureRejection = {
    status: 400,
    message: `Bad ${usernameOrEmail} or password`,
  };

  return checkUserExists(
    loginAttempt.usernameOrEmail,
    loginAttempt.usernameOrEmail
  )
    .then((existsResult) => {
      const userExists = existsResult.username
        ? existsResult.username
        : existsResult.email;

      if (userExists) {
        return db.query(
          `SELECT user_id, username, email
          FROM users
          WHERE ${usernameOrEmail} = $1
          AND password = $2`,
          [loginAttempt.usernameOrEmail, loginAttempt.password]
        );
      } else {
        return Promise.reject(obscureRejection);
      }
    })
    .then(({ rows }) => {
      return rows[0] ? rows[0] : Promise.reject(obscureRejection);
    });
};
