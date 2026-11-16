const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Ստեղծում ենք աղյուսակը, եթե չկա
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

// Գլխավոր էջ՝ պարզ գրանցման ձևաթղթով (HTML)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Nexus Club Registration</title>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        h2 { color: #333; margin-top: 0; }
        input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        button { background: #007bff; color: white; border: none; padding: 10px; width: 100%; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background: #0056b3; }
        a { display: block; margin-top: 15px; text-align: center; color: #007bff; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Nexus Club Membership</h2>
        <form action="/register" method="POST">
          <input type="text" name="name" placeholder="Full Name" required />
          <input type="email" name="email" placeholder="Email Address" required />
          <button type="submit">Register</button>
        </form>
        <a href="/members">View Members List</a>
      </div>
    </body>
    </html>
  `);
});

// Գրանցման մշակում (POST հարցում)
app.post('/register', async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query('INSERT INTO members (name, email) VALUES ($1, $2)', [name, email]);
    res.send(`
      <div style="font-family: Arial; text-align: center; margin-top: 50px;">
        <h2 style="color: green;">Successfully Registered!</h2>
        <p>Welcome to Nexus Club, ${name}.</p>
        <a href="/">Go Back</a> | <a href="/members">View Members</a>
      </div>
    `);
  } catch (err) {
    console.error(err);
    res.send(`
      <div style="font-family: Arial; text-align: center; margin-top: 50px;">
        <h2 style="color: red;">Registration Failed</h2>
        <p>This email might already be registered or database error occurred.</p>
        <a href="/">Try Again</a>
      </div>
    `);
  }
});

// Անդամների ցանկը (JSON կամ HTML ցուցադրություն)
app.get('/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members ORDER BY id DESC');
    let html = `
      <div style="font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px;">
        <h2>Nexus Club Members</h2>
        <ul style="list-style: none; padding: 0;">
    `;
    result.rows.forEach(m => {
      html += `<li style="background: #fff; margin-bottom: 10px; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <strong>${m.name}</strong> (${m.email}) <br><small style="color: gray;">Joined: ${m.created_at}</small>
               </li>`;
    });
    html += `
        </ul>
        <a href="/">Home Page</a>
      </div>
    `;
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


