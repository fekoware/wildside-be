const { Pool } = require('pg');

const db = new Pool();

if(!process.env.PGDATABASE) {
    throw new Error('no pg database configured')
}

module.exports = db;