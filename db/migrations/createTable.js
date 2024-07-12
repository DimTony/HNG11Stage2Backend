const createTables = `
CREATE TABLE IF NOT EXISTS users (
  "userId" VARCHAR(255) PRIMARY KEY,
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "organisations" UUID(255)[]
);

CREATE TABLE IF NOT EXISTS organisations (
  "orgId" UUID PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT
  
);
`;

module.exports = { createTables };
