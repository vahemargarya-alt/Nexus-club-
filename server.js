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

// 1. Գլխավոր էջ (Գրանցման նոր շքեղ ձևաթուղթ)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nexus Club - Premium</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background: linear-gradient(135deg, #080d16 0%, #1a202c 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; padding: 20px; }
        .card { background: rgba(22, 28, 37, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255, 215, 0, 0.1); padding: 40px; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); width: 100%; max-width: 420px; position: relative; overflow: hidden; }
        .card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, #b8860b, #ffd700, #b8860b); }
        h2 { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #ffd700; margin-bottom: 10px; text-align: center; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        p.subtitle { color: #d1d5db; font-size: 15px; text-align: center; margin-bottom: 30px; line-height: 1.5; }
        .form-group { margin-bottom: 20px; }
        label { display: block; font-size: 13px; font-weight: 600; color: #e5e7eb; margin-bottom: 8px; }
        input { width: 100%; padding: 14px 18px; background: rgba(31, 41, 55, 0.5); border: 1px solid #374151; border-radius: 12px; color: #fff; font-size: 16px; outline: none; transition: all 0.3s; }
        input:focus { border-color: #ffd700; box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.15); }
        button { width: 100%; margin-top: 10px; background: linear-gradient(90deg, #b8860b 0%, #ffd700 100%); color: #111827; border: none; padding: 16px; border-radius: 12px; cursor: pointer; font-size: 18px; font-weight: 700; transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; }
        button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(255, 215, 0, 0.3); }
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
          <button type="submit">Միանալ ակումբին</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// 2. Գրանցման պրոցես և Nexus Card-ի նոր էջ
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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background: linear-gradient(135deg, #080d16 0%, #1a202c 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; padding: 20px; }
          .container { width: 100%; max-width: 420px; }
          .card-nexus { background: linear-gradient(135deg, #2c3e50 0%, #000000 100%); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 20px; padding: 40px; box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7); position: relative; overflow: hidden; }
          .card-nexus::after { content: ''; position: absolute; bottom: -100px; right: -100px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; }
          .brand { font-size: 15px; font-weight: 800; letter-spacing: 2px; color: #ffd700; text-transform: uppercase; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; font-family: 'Playfair Display', serif; }
          .status-badge { background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 6px 14px; border-radius: 30px; font-size: 11px; font-weight: 700; border: 1px solid rgba(52, 211, 153, 0.3); text-transform: uppercase; }
          .member-name { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 10px; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
          .member-email { font-size: 14px; color: #d1d5db; margin-bottom: 35px; letter-spacing: 0.5px; }
          .perks { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 16px; margin-bottom: 35px; }
          .perks p { font-size: 14px; color: #f3f4f6; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; line-height: 1.6; }
          .perks p:last-child { margin-bottom: 0; }
          .perks b { color: #ffd700; font-weight: 600; }
          .footer-note { text-align: center; font-size: 12px; color: #9ca3af; }
          .btn-home { display: block; text-align: center; margin-top: 25px; background: rgba(55, 65, 81, 0.5); color: #e5e7eb; text-decoration: none; padding: 14px; border-radius: 12px; font-size: 14px; font-weight: 500; transition: all 0.3s; border: 1px solid transparent; }
          .btn-home:hover { background: rgba(75, 85, 99, 0.7); border-color: rgba(255, 215, 0, 0.2); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card-nexus">
            <div class="brand">
              <span>Nexus Club</span>
              <span class="status-badge">Գործող անդամ</span>
            </div>
            <div class="member-name">${name}</div>
            <div class="member-email">${email}</div>
            
            <div class="perks">
              <p>🛍️ <b>10% Զեղչ</b> Yerevan City սուպերմարկետներում</p>
              <p>🛒 <b>10% Զեղչ</b> MG սուպերմարկետներում</p>
              <p>💎 <b>Անդամավճար:</b> 8,000 AMD / ամիս</p>
            </div>

            <div class="footer-note">Ցույց տվեք այս քարտը կասսայում զեղչից օգտվելու համար։</div>
          </div>
          <a href="/" class="btn-home">← Վերադառնալ գլխավոր էջ</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    // Նույն սխալի էջը, բայց նոր ոճով
    res.send(`
      <!DOCTYPE html>
      <html lang="hy">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Սխալ</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background: linear-gradient(135deg, #080d16 0%, #1a202c 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; padding: 20px; }
          .card { background: rgba(22, 28, 37, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(239, 68, 68, 0.2); padding: 40px; border-radius: 20px; width: 100%; max-width: 400px; text-align: center; }
          h2 { color: #ef4444; font-size: 28px; margin-bottom: 15px; font-family: 'Playfair Display', serif; }
          p { color: #d1d5db; font-size: 15px; margin-bottom: 30px; }
          a { background: linear-gradient(90deg, #b91c1c 0%, #ef4444 100%); color: white; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-size: 15px; font-weight: 600; display: inline-block; transition: all 0.3s; }
          a:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.3); }
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

// 3. Ադմինի Մուտքի Էջ (Նոր ոճով)
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="utf-8">
      <title>Admin Login - Nexus Club</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background: linear-gradient(135deg, #080d16 0%, #1a202c 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; padding: 20px; }
        .card { background: rgba(22, 28, 37, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255, 215, 0, 0.1); padding: 40px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; }
        h2 { font-family: 'Playfair Display', serif; font-size: 28px; color: #ffd700; margin-bottom: 15px; }
        p.subtitle { color: #d1d5db; font-size: 13px; margin-bottom: 25px; }
        .form-group { margin-bottom: 20px; text-align: left; }
        input { width: 100%; padding: 14px 18px; background: rgba(31, 41, 55, 0.5); border: 1px solid #374151; border-radius: 12px; color: #fff; font-size: 16px; outline: none; }
        input:focus { border-color: #ffd700; }
        button { width: 100%; background: linear-gradient(90deg, #b8860b 0%, #ffd700 100%); color: #111827; border: none; padding: 16px; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        button:hover { box-shadow: 0 10px 20px -5px rgba(255, 215, 0, 0.3); }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Ադմին Մուտք</h2>
        <p class="subtitle">Մուտքագրեք գաղտնաբառը բազան տեսնելու համար</p>
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

// 4. Ադմինի Գաղտնի Վահանակ (Նոր ոճով)
app.post('/admin-dashboard', async (req, res) => {
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="hy">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Սխալ գաղտնաբառ</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          body { background: linear-gradient(135deg, #080d16 0%, #1a202c 100%); color: #fff; font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; padding: 20px; }
          .error-box { text-align: center; background: rgba(22, 28, 37, 0.75); padding: 40px; border-radius: 20px; border: 1px solid rgba(255, 215, 0, 0.1); }
          h2 { color: #ef4444; margin-bottom: 10px; font-family: 'Playfair Display', serif; }
          a { color: #ffd700; text-decoration: none; font-weight: 600; }
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
      rowsHtml = `<tr><td colspan="3" style="text-align: center; color: #94a3b8; padding: 24px;">Դեռևս գրանցված անդամներ չկան։</td></tr>`;
    } else {
      result.rows.forEach(m => {
        rowsHtml += `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
            <td style="padding: 16px; color: #fff; font-weight: 500;">${m.name}</td>
            <td style="padding: 16px; color: #d1d5db;">${m.email}</td>
            <td style="padding: 16px; color: #9ca3af; font-size: 13px;">${new Date(m.created_at).toLocaleString()}</td>
          </tr>
        `;
      });
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="hy">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nexus Club - Admin Panel</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background: linear-gradient(135deg, #080d16 0%, #1a202c 100%); min-height: 100vh; padding: 40px 20px; color: #f8fafc; }
          .container { max-width: 900px; margin: 0 auto; background: rgba(22, 28, 37, 0.75); border: 1px solid rgba(255, 215, 0, 0.1); padding: 30px; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
          h2 { font-family: 'Playfair Display', serif; font-size: 28px; color: #ffd700; }
          a.back-btn { background: rgba(55, 65, 81, 0.5); color: #e5e7eb; text-decoration: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 500; transition: all 0.3s; }
          a.back-btn:hover { background: rgba(75, 85, 99, 0.7); }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { background: rgba(31, 41, 55, 0.5); color: #e5e7eb; padding: 16px; font-size: 13px; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.1); text-transform: uppercase; letter-spacing: 0.5px; }
          .badge { background: rgba(52, 211, 153, 0.15); color: #34d399; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; border: 1px solid rgba(52, 211, 153, 0.3); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Ադմին Վահանակ <span class="badge">SECURE</span></h2>
            <a href="/admin" class="back-btn">Ելք (Log out)</a>
          </div>
          <p style="color: #d1d5db; font-size: 14px; margin-bottom: 25px;">Սա գաղտնի էջ է։ Այստեղ երևում են միայն ձեր ակումբի անդամները։</p>
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
