// require('dotenv').config();
// const pg = require('pg');

// const db = new pg.Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   ssl: {
//     rejectUnauthorized: false, // Set this to true if you have the server's certificate
//   },
// });

// module.exports = { db };

require('dotenv').config();
const { Pool } = require('pg');

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Set this to true if you have the server's certificate
  },
};

const db = new Pool(dbConfig);

module.exports = { db };
