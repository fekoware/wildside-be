const db = require("../db/connection");

module.exports = (username, email) => {
    const usernameQuery = db.query('SELECT * FROM users WHERE username = $1', [username]);
    const emailQuery = db.query('SELECT * FROM users WHERE email = $1', [email]);

    return Promise.all([usernameQuery, emailQuery])
        .then(([usernameResult, emailResult]) => {
            const conflicts = {};
            if (usernameResult.rows.length > 0) {
                conflicts.username = true;
            }
            if (emailResult.rows.length > 0) {
                conflicts.email = true;
            }
            return conflicts;
        });
}
