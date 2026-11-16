
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Ստեղծում ենք աղյուսակ բազայում, եթե այն դեռ գոյություն չունի
pool.query(`
  CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).then(() => {
  console.log("Database table 'members' is ready.");
}).catch(err => {
  console.error("Error creating table:", err);
});

app.get('/', (req, res) => {
  res.send('Nexus Club Server is running with PostgreSQL database connected!');
});

// Օրինակ՝ անդամների ցանկը ստանալու API
app.get('/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
