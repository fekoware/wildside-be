const db = require("../db/connection");
const { checkUserExists } = require("../utils");

exports.insertUser = (newUser) => {
    if (!newUser.username || !newUser.password || !newUser.email) {
        return Promise.reject({
            status: 400,
            message: "All fields are required (username, password, email)",
        })
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
    return checkUserExists(newUser.username, newUser.email)
        .then((conflicts) => {
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
                        [
                            newUser.username,
                            newUser.password,
                            newUser.email,
                        ]
                    )
                    .then(({ rows }) => {
                        return rows[0];
                    });
            }
        })
}