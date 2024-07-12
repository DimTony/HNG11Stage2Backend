const express = require('express');
const { Pool } = require('pg');
const orgRoutes = require('./src/routes/orgRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { db } = require('./db');
const { runDbMigrations } = require('./db/migrations');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/organisations', orgRoutes);
app.use('/auth', authRoutes);

let server;

async function start() {
  try {
    // Run database migrations
    // await runDbMigrations();

    await db.connect();
    console.log('Database connected successfully!');

    // Start the server
    server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Error starting the application:', err.stack);
    process.exit(1);
  }
}

start();

module.exports = { app, server, db };
