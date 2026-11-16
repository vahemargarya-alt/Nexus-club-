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

// 1. Գլխավոր էջ (Զուսպ և Էլեգանտ Գրանցման ձևաթուղթ)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nexus Club - Էլեգանտ Անդամակցություն</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background-color: #f9fafb; min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #1f2937; padding: 20px; }
        .main-wrapper { width: 100%; max-width: 400px; }
        
        /* Header / Brand */
        .brand-header { text-align: center; margin-bottom: 40px; }
        .brand-logo { font-size: 24px; font-weight: 600; color: #111827; letter-spacing: -0.5px; }
        .brand-tagline { font-size: 14px; color: #6b7280; margin-top: 4px; }

        /* Elegant Card */
        .card { background: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03); }
        h2 { font-size: 22px; font-weight: 500; color: #111827; margin-bottom: 12px; text-align: left; }
        p.subtitle { color: #6b7280; font-size: 14px; text-align: left; margin-bottom: 30px; line-height: 1.5; }
        
        /* Form Elements */
        .form-group { margin-bottom: 20px; }
        label { display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 8px; }
        input { width: 100%; padding: 12px 14px; background: #ffffff; border: 1px solid #d1d5db; border-radius: 6px; color: #111827; font-size: 14px; outline: none; transition: border-color 0.2s; }
        input:focus { border-color: #4f46e5; ring-1 ring-indigo-600; }
        
        /* Button - Subtle but premium */
        button { width: 100%; margin-top: 10px; background-color: #111827; color: #ffffff; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background-color 0.2s; }
        button:hover { background-color: #374151; }

        /* Footer */
        .footer-text { text-align: center; margin-top: 30px; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="main-wrapper">
        <div class="brand-header">
          <div class="brand-logo">Nexus Club</div>
          <div class="brand-tagline">Էլեգանտ Անդամակցություն</div>
        </div>
        
        <div class="card">
          <h2>Բարի գալուստ</h2>
          <p class="subtitle">Լրացրեք ձեր տվյալները՝ 8,000 AMD/ամիս անդամակցությունը սկսելու և Yerevan City-ում ու MG-ում 10% զեղչ ստանալու համար։</p>
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
        
        <div class="footer-text">
            <p>© 2026 Nexus Club Technologies. Բոլոր իրավունքները պաշտպանված։</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// 2. Գրանցման պրոցես և Nexus Card-ի նոր ոճը
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
        <title>Ձեր Nexus Card - Nexus Club</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background-color: #f9fafb; min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #1f2937; padding: 20px; }
          .container { width: 100%; max-width: 420px; }
          
          /* The Card - Clean & Professional */
          .card-nexus { background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 35px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); position: relative; overflow: hidden; }
          
          /* Top header of the card */
          .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
          .brand-text { font-size: 16px; font-weight: 600; color: #111827; }
          .status-badge { background-color: #ecfdf5; color: #059669; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          
          /* Member Info on Card */
          .member-name { font-size: 22px; font-weight: 500; color: #111827; margin-bottom: 6px; }
          .member-email { font-size: 13px; color: #6b7280; margin-bottom: 30px; }
          
          /* Perks Section on Card */
          .perks-list { border-top: 1px solid #f3f4f6; padding-top: 25px; }
          .perk-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #374151; margin-bottom: 10px; line-height: 1.5; }
          .perk-item:last-child { margin-bottom: 0; }
          .perk-icon { width: 16px; height: 16px; color: #4f46e5; }
          .perk-value { font-weight: 600; color: #111827; }

          /* Footer Note on Card */
          .footer-card-note { text-align: center; font-size: 11px; color: #9ca3af; margin-top: 35px; }

          /* Back button */
          .btn-home { display: block; text-align: center; margin-top: 25px; background-color: transparent; color: #6b7280; text-decoration: none; padding: 12px; border-radius: 6px; font-size: 13px; transition: color 0.2s; border: 1px solid transparent; }
          .btn-home:hover { color: #111827; border-color: #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card-nexus">
            <div class="card-header">
              <div class="brand-text">Nexus Card</div>
              <span class="status-badge">● Ակտիվ</span>
            </div>
            <div class="member-name">${name}</div>
            <div class="member-email">${email}</div>
            
            <div class="perks-list">
              <p class="perk-item">
                <svg class="perk-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                Yerevan City սուպերմարկետներում: <span class="perk-value">10% Զեղչ</span>
              </p>
              <p class="perk-item">
                <svg class="perk-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                MG սուպերմարկետներում: <span class="perk-value">10% Զեղչ</span>
              </p>
              <p class="perk-item">
                <svg class="perk-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                Անդամավճար: <span class="perk-value">8,000 AMD/ամիս</span>
              </p>
            </div>
            <div class="footer-card-note">Ցույց տվեք այս թվային քարտը կասսայում զեղչից օգտվելու համար։</div>
          </div>
          <a href="/" class="btn-home">← Վերադառնալ գլխավոր էջ</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    // Սխալի էջը նույնպես նոր, զուսպ ոճով
    res.send(`
      <!DOCTYPE html>
      <html lang="hy">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Սխալ - Nexus Club</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background-color: #f9fafb; min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #1f2937; padding: 20px; }
          .card { background: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #e5e7eb; width: 100%; max-width: 400px; text-align: center; }
          h2 { color: #dc2626; font-size: 20px; font-weight: 500; margin-bottom: 12px; }
          p { color: #6b7280; font-size: 14px; margin-bottom: 30px; }
          a { background-color: #dc2626; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; display: inline-block; }
          a:hover { background-color: #b91c1c; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Գրանցումը ձախողվեց</h2>
          <p>Այս էլ. հասցեն արդեն գրանցված է համակարգում, կամ տեղի է ունեցել տեխնիկական սխալ։</p>
          <a href="/">Կրկին փորձել</a>
        </div>
      </body>
      </html>
    `);
  }
});

// 3. Ադմինի Մուտքի Էջ (Զուսպ ոճով)
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="utf-8">
      <title>Ադմին Մուտք - Nexus Club</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background-color: #f9fafb; min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #1f2937; padding: 20px; }
        .card { background: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #e5e7eb; width: 100%; max-width: 380px; text-align: center; }
        h2 { font-size: 20px; font-weight: 500; color: #111827; margin-bottom: 12px; }
        p.subtitle { color: #6b7280; font-size: 13px; margin-bottom: 25px; }
        .form-group { margin-bottom: 20px; text-align: left; }
        input { width: 100%; padding: 12px 14px; background: #ffffff; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; }
        button { width: 100%; background-color: #111827; color: #ffffff; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Ադմինիստրատոր</h2>
        <p class="subtitle">Մուտքագրեք գաղտնաբառը</p>
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

// 4. Ադմինի Գաղտնի Վահանակ (Մաքուր ոճով)
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
        <style>
          body { background-color: #f9fafb; color: #1f2937; font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; padding: 20px; }
          .error-box { text-align: center; background: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #e5e7eb; }
          h2 { color: #dc2626; margin-bottom: 10px; font-size: 20px; font-weight: 500; }
          a { color: #4f46e5; text-decoration: none; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="error-box">
          <h2>Սխալ գաղտնաբառ!</h2>
          <p><a href="/admin">← Վերադառնալ</a></p>
        </div>
      </body>
      </html>
    `);
  }

  try {
    const result = await pool.query('SELECT * FROM members ORDER BY id DESC');
    let rowsHtml = '';
    
    if (result.rows.length === 0) {
      rowsHtml = `<tr><td colspan="3" style="text-align: center; color: #9ca3af; padding: 24px; font-size: 13px;">Դեռևս գրանցված անդամներ չկան։</td></tr>`;
    } else {
      result.rows.forEach(m => {
        rowsHtml += `
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 16px; color: #111827; font-weight: 500; font-size: 13px;">${m.name}</td>
            <td style="padding: 16px; color: #374151; font-size: 13px;">${m.email}</td>
            <td style="padding: 16px; color: #6b7280; font-size: 12px;">${new Date(m.created_at).toLocaleString()}</td>
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
        <title>Nexus Club - Ադմին Վահանակ</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background-color: #f9fafb; min-height: 100vh; padding: 40px 20px; color: #1f2937; }
          .container { max-width: 900px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; padding: 30px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
          h2 { font-size: 18px; font-weight: 600; color: #111827; }
          a.back-btn { background-color: #f3f4f6; color: #374151; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; transition: background-color 0.2s; }
          a.back-btn:hover { background-color: #e5e7eb; }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { background-color: #f9fafb; color: #6b7280; padding: 16px; font-size: 11px; font-weight: 600; border-bottom: 1px solid #e5e7eb; text-transform: uppercase; letter-spacing: 0.5px; }
          .badge { background-color: #ecfdf5; color: #059669; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Անդամների Բազա <span class="badge">Secure</span></h2>
            <a href="/admin" class="back-btn">Ելք</a>
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
