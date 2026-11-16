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

// Ավտոմատ ստեղծում ենք աղյուսակը
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

// Գլխավոր էջ՝ ժամանակակից և գեղեցիկ դիզայնով
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nexus Club - Registration</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; }
        .card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); width: 100%; max-width: 420px; }
        h2 { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 8px; text-align: center; }
        p.subtitle { color: #94a3b8; font-size: 14px; text-align: center; margin-bottom: 24px; }
        .form-group { margin-bottom: 16px; }
        label { display: block; font-size: 13px; font-weight: 500; color: #cbd5e1; margin-bottom: 6px; }
        input { width: 100%; padding: 12px 16px; background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 8px; color: #fff; font-size: 15px; outline: none; transition: all 0.3s; }
        input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
        button { width: 100%; margin-top: 8px; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; transition: opacity 0.2s; }
        button:hover { opacity: 0.9; }
        .links { margin-top: 20px; text-align: center; }
        a { color: #818cf8; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        a:hover { color: #a5b4fc; text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Nexus Club</h2>
        <p class="subtitle">Միացե՛ք մեր փակ համայնքին</p>
        <form action="/register" method="POST">
          <div class="form-group">
            <label>Անուն Ազգանուն</label>
            <input type="text" name="name" placeholder="Օր. Վահե Մարգարյան" required />
          </div>
          <div class="form-group">
            <label>Էլ. Հասցե (Email)</label>
            <input type="email" name="email" placeholder="example@gmail.com" required />
          </div>
          <button type="submit">Գրանցվել</button>
        </form>
        <div class="links">
          <a href="/members">Դիտել անդամների ցանկը →</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Գրանցման պրոցես և հաջողված կամ սխալի գեղեցիկ էջեր
app.post('/register', async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query('INSERT INTO members (name, email) VALUES ($1, $2)', [name, email]);
    res.send(`
      <!DOCTYPE html>
      <html lang="hy">
      <head>
        <meta charset="utf-8">
        <title>Հաջողված գրանցում</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; }
          .card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); width: 100%; max-width: 420px; text-align: center; }
          h2 { color: #34d399; font-size: 22px; margin-bottom: 12px; }
          p { color: #cbd5e1; font-size: 15px; margin-bottom: 24px; }
          .btn-group { display: flex; gap: 10px; justify-content: center; }
          a { background: #334155; color: #fff; text-decoration: none; padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; transition: background 0.2s; }
          a.primary { background: #6366f1; }
          a:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Հաջողությամբ գրանցվեցիք!</h2>
          <p>Ողջույն Nexus Club, <b>${name}</b>։ Ձեր տվյալները հաջողությամբ պահպանվեցին։</p>
          <div class="btn-group">
            <a href="/">Գլխավոր</a>
            <a href="/members" class="primary">Անդամներ</a>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.send(`
      <!DOCTYPE html>
      <html lang="hy">
      <head>
        <meta charset="utf-8">
        <title>Սխալ</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; }
          .card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); width: 100%; max-width: 420px; text-align: center; }
          h2 { color: #f87171; font-size: 22px; margin-bottom: 12px; }
          p { color: #cbd5e1; font-size: 14px; margin-bottom: 24px; word-break: break-all; }
          a { background: #6366f1; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; }
          a:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Գրանցումը ձախողվեց</h2>
          <p>Այս էլ. հասցեն արդեն գրանցված է կամ տեղի է ունեցել սխալ։</p>
          <a href="/">Կրկին փորձել</a>
        </div>
      </body>
      </html>
    `);
  }
});

// Անդամների ցանկի գեղեցիկ էջ
app.get('/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members ORDER BY id DESC');
    let rowsHtml = '';
    
    if (result.rows.length === 0) {
      rowsHtml = `<tr><td colspan="3" style="text-align: center; color: #94a3b8; padding: 20px;">Դեռևս գրանցված անդամներ չկան։</td></tr>`;
    } else {
      result.rows.forEach(m => {
        rowsHtml += `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 12px 16px; color: #fff; font-weight: 500;">${m.name}</td>
            <td style="padding: 12px 16px; color: #94a3b8;">${m.email}</td>
            <td style="padding: 12px 16px; color: #64748b; font-size: 13px;">${new Date(m.created_at).toLocaleString()}</td>
          </tr>
        `;
      });
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="hy">
      <head>
        <meta charset="utf-8">
        <title>Nexus Club - Անդամներ</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); min-height: 100vh; padding: 40px 20px; color: #f8fafc; }
          .container { max-width: 700px; margin: 0 auto; background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
          h2 { font-size: 20px; font-weight: 700; color: #fff; }
          a.back-btn { background: #334155; color: #fff; text-decoration: none; padding: 8px 14px; border-radius: 6px; font-size: 13px; font-weight: 500; }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { background: rgba(15, 23, 42, 0.5); color: #cbd5e1; padding: 12px 16px; font-size: 13px; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.1); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nexus Club Անդամներ</h2>
            <a href="/" class="back-btn">← Գլխավոր</a>
          </div>
          <div style="overflow-x: auto;">
            <table>
              <thead>
                <tr>
                  <th>Անուն</th>
                  <th>Էլ. Հասցե</th>
                  <th>Գրանցման ամսաթիվ</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Database error: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
