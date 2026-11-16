const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'CityPremium2026!';

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

// 1. Գլխավոր էջ (Գրանցման ձևաթուղթ)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nexus Club</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; padding: 20px; }
        .card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); width: 100%; max-width: 420px; }
        h2 { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 8px; text-align: center; }
        p.subtitle { color: #94a3b8; font-size: 14px; text-align: center; margin-bottom: 24px; line-height: 1.4; }
        .form-group { margin-bottom: 16px; }
        label { display: block; font-size: 13px; font-weight: 500; color: #cbd5e1; margin-bottom: 6px; }
        input { width: 100%; padding: 12px 16px; background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 8px; color: #fff; font-size: 15px; outline: none; transition: all 0.3s; }
        input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
        button { width: 100%; margin-top: 8px; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; transition: opacity 0.2s; }
        button:hover { opacity: 0.9; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Nexus Club</h2>
        <p class="subtitle">Գրանցվե՛ք (8,000 դրամ/ամիս) և ստացեք 10% զեղչ Yerevan City-ում և MG-ում</p>
        <form action="/register" method="POST">
          <div class="form-group">
            <label>Անուն Ազգանուն</label>
            <input type="text" name="name" placeholder="Օր. Վահե Մարգարյան" required />
          </div>
          <div class="form-group">
            <label>Էլ. Հասցե (Email)</label>
            <input type="email" name="email" placeholder="example@gmail.com" required />
          </div>
          <button type="submit">Միանալ Nexus Club-ին</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// 2. Գրանցման պրոցես և Nexus Card-ի էջ
app.post('/register', async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query('INSERT INTO members (name, email) VALUES ($1, $2)', [name, email]);
    
    res.send(`
      <!DOCTYPE html>
      <html lang="hy">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nexus Card - Nexus Club</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; padding: 20px; }
          .container { width: 100%; max-width: 400px; }
          .card-nexus { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; padding: 30px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); position: relative; overflow: hidden; }
          .card-nexus::before { content: ''; position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(99, 102, 241, 0.15); border-radius: 50%; filter: blur(30px); }
          .brand { font-size: 14px; font-weight: 700; letter-spacing: 2px; color: #818cf8; text-transform: uppercase; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .status-badge { background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid rgba(52, 211, 153, 0.3); }
          .member-name { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 6px; }
          .member-email { font-size: 13px; color: #94a3b8; margin-bottom: 24px; }
          .perks { background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 12px; margin-bottom: 24px; }
          .perks p { font-size: 13px; color: #cbd5e1; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
          .perks p:last-child { margin-bottom: 0; }
          .footer-note { text-align: center; font-size: 12px; color: #64748b; }
          .btn-home { display: block; text-align: center; margin-top: 20px; background: #334155; color: #fff; text-decoration: none; padding: 10px; border-radius: 8px; font-size: 14px; font-weight: 500; transition: background 0.2s; }
          .btn-home:hover { background: #475569; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card-nexus">
            <div class="brand">
              <span>Nexus Card</span>
              <span class="status-badge">● Ակտիվ</span>
            </div>
            <div class="member-name">${name}</div>
            <div class="member-email">${email}</div>
            
            <div class="perks">
              <p>🛍️ <b>10% Զեղչ</b> Yerevan City սուպերմարկետներում</p>
              <p>🛒 <b>10% Զեղչ</b> MG սուպերմարկետներում</p>
              <p>💎 <b>Անդամավճար:</b> 8,000 AMD / ամիս</p>
            </div>

            <div class="footer-note">Ցույց տվեք այս Nexus Card-ը կամ տվյալները կասսայում զեղչից օգտվելու համար։</div>
          </div>
          <a href="/" class="btn-home">← Վերադառնալ գլխավոր էջ</a>
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
          body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; padding: 20px; }
          .card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); width: 100%; max-width: 420px; text-align: center; }
          h2 { color: #f87171; font-size: 22px; margin-bottom: 12px; }
          p { color: #cbd5e1; font-size: 14px; margin-bottom: 24px; }
          a { background: #6366f1; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; display: inline-block; }
          a:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Գրանցումը ձախողվեց</h2>
          <p>Այս էլ. հասցեն արդեն գրանցված է համակարգում։</p>
          <a href="/">Կրկին փորձել</a>
        </div>
      </body>
      </html>
    `);
  }
});

// 3. Ադմինի Մուտքի Էջ
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="utf-8">
      <title>Admin Login - Nexus Club</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; padding: 20px; }
        .card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); width: 100%; max-width: 380px; }
        h2 { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 8px; text-align: center; }
        p.subtitle { color: #94a3b8; font-size: 13px; text-align: center; margin-bottom: 20px; }
        .form-group { margin-bottom: 16px; }
        input { width: 100%; padding: 12px 16px; background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 8px; color: #fff; font-size: 15px; outline: none; }
        button { width: 100%; background: #6366f1; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 600; }
        button:hover { opacity: 0.9; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Ադմին Մուտք</h2>
        <p class="subtitle">Մուտքագրեք գաղտնաբառը անդամների բազան տեսնելու համար</p>
        <form action="/admin-dashboard" method="POST">
          <div class="form-group">
            <input type="password" name="password" placeholder="Գաղտնաբառ" required />
          </div>
          <button type="submit">Մուտք</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// 4. Ադմինի Գաղտնի Վահանակ
app.post('/admin-dashboard', async (req, res) => {
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="hy">
      <head>
        <meta charset="utf-8">
        <title>Սխալ գաղտնաբառ</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body { background: #0f172a; color: #fff; font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; padding: 20px; }
          .error-box { text-align: center; background: rgba(30, 41, 59, 0.7); padding: 30px; border-radius: 12px; }
          h2 { color: #f87171; margin-bottom: 10px; }
          a { color: #818cf8; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="error-box">
          <h2>Սխալ գաղտնաբառ!</h2>
          <p><a href="/admin">← Վերադառնալ և կրկին փորձել</a></p>
        </div>
      </body>
      </html>
    `);
  }

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
        <title>Nexus Club - Ադմին Վահանակ</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); min-height: 100vh; padding: 40px 20px; color: #f8fafc; }
          .container { max-width: 800px; margin: 0 auto; background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
          h2 { font-size: 20px; font-weight: 700; color: #fff; }
          a.back-btn { background: #334155; color: #fff; text-decoration: none; padding: 8px 14px; border-radius: 6px; font-size: 13px; font-weight: 500; }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { background: rgba(15, 23, 42, 0.5); color: #cbd5e1; padding: 12px 16px; font-size: 13px; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .badge { background: #10b981; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nexus Club Անդամներ <span class="badge">Անվտանգ</span></h2>
            <a href="/admin" class="back-btn">Ելք (Log out)</a>
          </div>
          <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px;">Այս ցանկը տեսանելի է միայն ձեզ։ Օգտագործեք այս տվյալները ձեր հաճախորդներին առաջարկներ ուղարկելու համար։</p>
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
