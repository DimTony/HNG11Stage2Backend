const { db } = require('../index');
const { createTables } = require('./createTable');

const runDbMigrations = async () => {
  console.log('BEGIN DB MIGRATION');

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    await client.query(createTables);

    await client.query('COMMIT');

    console.log('END DB MIGRATION');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { runDbMigrations };
