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

// Ստեղծում ենք աղյուսակը
pool.query(`
  CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    card_number VARCHAR(20) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error("Database error:", err));

// Միակ Էտալոնային Մեկ Էջը (Landing + Digital Card + Features)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>nexuscard.am — Բացառիկ Անդամակցություն</title>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Libre+Barcode+128&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg-color: #060913;
          --card-bg: rgba(17, 24, 39, 0.7);
          --border-color: rgba(255, 255, 255, 0.08);
          --accent-gold: #f59e0b;
          --text-main: #f9fafb;
          --text-muted: #9ca3af;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background-color: var(--bg-color); color: var(--text-main); min-height: 100vh; overflow-x: hidden; }
        
        /* Background Glow FX */
        .glow-sphere {
          position: fixed; width: 500px; height: 500px; background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(0,0,0,0) 70%);
          top: -200px; left: 50%; transform: translateX(-50%); z-index: -1; pointer-events: none;
        }

        .container { max-width: 1100px; margin: 0 auto; padding: 40px 20px; }

        /* Header */
        header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px; }
        .logo { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; color: #fff; display: flex; align-items: center; gap: 8px; }
        .logo span { color: #818cf8; }
        .admin-link { font-size: 13px; color: var(--text-muted); text-decoration: none; border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 99px; transition: all 0.2s; }
        .admin-link:hover { border-color: #818cf8; color: #fff; }

        /* Hero Section */
        .hero { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 50px; align-items: center; margin-bottom: 80px; }
        @media(max-width: 768px) { .hero { grid-template-columns: 1fr; gap: 40px; } }

        .hero-content h1 { font-size: 42px; font-weight: 700; line-height: 1.15; margin-bottom: 20px; letter-spacing: -1px; }
        .hero-content h1 span { background: linear-gradient(135deg, #fff 0%, #818cf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-content p { font-size: 16px; color: var(--text-muted); line-height: 1.6; margin-bottom: 30px; }

        /* Features Grid */
        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px; }
        .feature-box { background: var(--card-bg); border: 1px solid var(--border-color); padding: 18px; border-radius: 12px; backdrop-filter: blur(10px); }
        .feature-box h3 { font-size: 18px; font-weight: 700; color: #34d399; margin-bottom: 4px; }
        .feature-box p { font-size: 12px; color: var(--text-muted); }

        /* Registration Form Card */
        .glass-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 24px; padding: 35px; backdrop-filter: blur(20px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .form-title { font-size: 20px; font-weight: 600; margin-bottom: 8px; }
        .form-subtitle { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; }
        
        .input-group { margin-bottom: 16px; }
        .input-group label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 6px; }
        .input-group input { width: 100%; padding: 14px 16px; background: rgba(3, 7, 18, 0.6); border: 1px solid var(--border-color); border-radius: 12px; color: #fff; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .input-group input:focus { border-color: #818cf8; }

        .btn-submit { width: 100%; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #fff; border: none; padding: 16px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: transform 0.1s, opacity 0.2s; margin-top: 10px; }
        .btn-submit:hover { opacity: 0.9; }

        .secure-note { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; color: var(--text-muted); margin-top: 16px; }

        footer { text-align: center; padding: 40px 0; font-size: 12px; color: var(--text-muted); border-top: 1px solid var(--border-color); }
      </style>
    </head>
    <body>
      <div class="glow-sphere"></div>
      <div class="container">
        <header>
          <div class="logo">nexus<span>card.am</span></div>
          <a href="/admin" class="admin-link">Ադմին Մուտք</a>
        </header>

        <section class="hero">
          <div class="hero-content">
            <h1>Բացառիկ արտոնություններ <span>Մեկ քարտով</span></h1>
            <p>Ստացեք VIP կարգավիճակ, անսահմանափակ 10% զեղչեր Yerevan City և MG սուպերմարկետներում։ Կորպորատիվ բարեկեցության նոր, բանկային մակարդակի ձևաչափ։</p>
            
            <div class="features-grid">
              <div class="feature-box">
                <h3>10% Զեղչ</h3>
                <p>Yerevan City & MG ցանցերում</p>
              </div>
              <div class="feature-box">
                <h3>8,000 AMD</h3>
                <p>Ամսական բաժանորդագրություն</p>
              </div>
            </div>
          </div>

          <div>
            <div class="glass-card">
              <div class="form-title">Անդամակցության Ակտիվացում</div>
              <div class="form-subtitle">Լրացրեք տվյալները IDBank վճարման և թվային քարտի ստացման համար։</div>
              
              <form action="/register" method="POST">
                <div class="input-group">
                  <label>Անուն Ազգանուն</label>
                  <input type="text" name="name" placeholder="Վահե Մարգարյան" required />
                </div>
                <div class="input-group">
                  <label>Էլեկտրոնային Հասցե</label>
                  <input type="email" name="email" placeholder="example@gmail.com" required />
                </div>
                <button type="submit" class="btn-submit">Ակտիվացնել IDBank-ով</button>
              </form>

              <div class="secure-note">
                <span>🔒 256-bit Բանկային Անվտանգություն</span>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <p>© 2026 nexuscard.am. Բոլոր իրավունքները պաշտպանված են։</p>
        </footer>
      </div>
    </body>
    </html>
  `);
});

// 2. Գրանցման Հաջողված Էջը (Շքեղ բանկային քարտ + ետևի շտրիխ կոդ)
app.post('/register', async (req, res) => {
  const { name, email } = req.body;
  const cardNumber = '5400 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000);

  try {
    await pool.query('INSERT INTO members (name, email, card_number) VALUES ($1, $2, $3)', [name, email, cardNumber]);
    
    res.send(`
      <!DOCTYPE html>
      <html lang="hy">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ձեր Nexus Card — nexuscard.am</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Libre+Barcode+128&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
          body { background-color: #060913; min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f9fafb; padding: 20px; }
          .wrapper { width: 100%; max-width: 420px; }
          
          .success-title { text-align: center; margin-bottom: 24px; }
          .success-title h2 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
          .success-title p { font-size: 13px; color: #9ca3af; }

          /* Bank Card Front */
          .bank-card { background: linear-gradient(135deg, #111827 0%, #030712 100%); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 25px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); margin-bottom: 20px; position: relative; overflow: hidden; }
          .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
          .brand { font-size: 14px; font-weight: 700; letter-spacing: 1px; color: #fff; }
          .badge-idbank { font-size: 10px; background: rgba(99,102,241,0.2); color: #818cf8; padding: 4px 10px; border-radius: 99px; font-weight: 600; }
          
          .chip { width: 42px; height: 32px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 6px; margin-bottom: 20px; position: relative; }
          .card-number { font-family: monospace; font-size: 19px; letter-spacing: 3px; color: #e5e7eb; margin-bottom: 25px; }
          
          .card-footer { display: flex; justify-content: space-between; align-items: flex-end; }
          .label { font-size: 9px; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.5px; }
          .holder { font-size: 15px; font-weight: 600; text-transform: uppercase; color: #fff; }
          .exp { font-family: monospace; font-size: 13px; color: #d1d5db; }

          /* Card Back / Barcode */
          .card-back { background: #030712; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 25px; text-align: center; }
          .back-header { font-size: 11px; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px; margin-bottom: 14px; }
          
          .barcode-container { background: #fff; padding: 12px; border-radius: 12px; display: inline-block; margin-bottom: 10px; }
          .barcode { font-family: 'Libre Barcode 128', cursive; font-size: 56px; color: #000; line-height: 1; }
          .barcode-num { font-family: monospace; font-size: 12px; color: #374151; letter-spacing: 2px; }

          .perks { margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px; text-align: left; font-size: 12px; color: #d1d5db; }
          .perks div { display: flex; justify-content: space-between; margin-bottom: 6px; }
          .perks span { font-weight: 600; color: #34d399; }

          .btn-back { display: block; text-align: center; margin-top: 20px; background: transparent; color: #9ca3af; text-decoration: none; font-size: 13px; padding: 12px; transition: color 0.2s; }
          .btn-back:hover { color: #fff; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="success-title">
            <h2>Շնորհավորում ենք</h2>
            <p>Ձեր թվային Nexus Card-ը հաջողությամբ ակտիվացված է</p>
          </div>

          <!-- Առջևի Մաս -->
          <div class="bank-card">
            <div class="card-top">
              <span class="brand">NEXUS CLUB</span>
              <span class="badge-idbank">IDBank Verified</span>
            </div>
            <div class="chip"></div>
            <div class="card-number">${cardNumber}</div>
            <div class="card-footer">
              <div>
                <div class="label">Cardholder</div>
                <div class="holder">${name}</div>
              </div>
              <div class="exp">09/28</div>
            </div>
          </div>

          <!-- Հետևի Մաս (Շտրիխ Կոդ) -->
          <div class="card-back">
            <div class="back-header">Կասսայում սկանավորման կոդ</div>
            <div class="barcode-container">
              <div class="barcode">*${cardNumber.replace(/\s/g, '')}*</div>
              <div class="barcode-num">${cardNumber}</div>
            </div>
            <div class="perks">
              <div>Yerevan City / MG Զեղչ: <span>10% Ակտիվ</span></div>
              <div>Ամսական վճար: <span>8,000 AMD</span></div>
            </div>
          </div>

          <a href="/" class="btn-back">← Վերադառնալ գլխավոր էջ</a>
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
        <style>
          body { background: #060913; color: #fff; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; }
          .box { background: #111827; padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
          h2 { color: #ef4444; margin-bottom: 10px; }
          a { color: #818cf8; text-decoration: none; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="box">
          <h2>Գրանցման սխալ</h2>
          <p style="color: #9ca3af; margin-bottom: 20px; font-size: 13px;">Այս էլ. հասցեն արդեն գրանցված է կամ տեղի է ունեցել սխալ։</p>
          <a href="/">Կրկին փորձել</a>
        </div>
      </body>
      </html>
    `);
  }
});

// 3. Ադմին Մուտք և Վահանակ
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="utf-8">
      <title>Admin Login — nexuscard.am</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; }
        body { background: #060913; min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #fff; padding: 20px; }
        .box { background: #111827; padding: 35px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); width: 100%; max-width: 380px; text-align: center; }
        h2 { font-size: 18px; margin-bottom: 8px; }
        p { color: #9ca3af; font-size: 12px; margin-bottom: 20px; }
        input { width: 100%; padding: 12px 14px; background: #030712; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 14px; margin-bottom: 16px; outline: none; }
        button { width: 100%; background: #6366f1; color: #fff; border: none; padding: 12px; border-radius: 10px; font-weight: 600; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="box">
        <h2>Ադմինիստրատոր</h2>
        <p>Մուտքագրեք կառավարման գաղտնաբառը</p>
        <form action="/admin-dashboard" method="POST">
          <input type="password" name="password" placeholder="Գաղտնաբառ" required />
          <button type="submit">Մուտք</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

app.post('/admin-dashboard', async (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.send(`<body style="background:#060913;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;"><div style="text-align:center;"><h2>Սխալ գաղտնաբառ</h2><br><a href="/admin" style="color:#818cf8;text-decoration:none;">Վերադառնալ</a></div></body>`);
  }

  try {
    const result = await pool.query('SELECT * FROM members ORDER BY id DESC');
    let rows = '';
    if (result.rows.length === 0) {
      rows = `<tr><td colspan="4" style="text-align:center;padding:30px;color:#9ca3af;">Գրանցված անդամներ դեռևս չկան</td></tr>`;
    } else {
      result.rows.forEach(m => {
        rows += `
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
            <td style="padding:14px;font-weight:500;">${m.name}</td>
            <td style="padding:14px;color:#9ca3af;">${m.email}</td>
            <td style="padding:14px;font-family:monospace;color:#818cf8;">${m.card_number || 'N/A'}</td>
            <td style="padding:14px;color:#9ca3af;font-size:12px;">${new Date(m.created_at).toLocaleString()}</td>
          </tr>
        `;
      });
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="hy">
      <head>
        <meta charset="utf-8">
        <title>Admin Dashboard — nexuscard.am</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; }
          body { background: #060913; padding: 40px 20px; color: #fff; min-height: 100vh; }
          .container { max-width: 900px; margin: 0 auto; background: #111827; border: 1px solid rgba(255,255,255,0.08); padding: 30px; border-radius: 20px; }
          .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
          th { background: #030712; color: #9ca3af; padding: 12px 14px; font-weight: 600; text-transform: uppercase; font-size: 11px; }
          .exit { background: rgba(255,255,255,0.05); color: #fff; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="top">
            <h2>Անդամների Բազա (IDBank Verified)</h2>
            <a href="/admin" class="exit">Ելք</a>
          </div>
          <div style="overflow-x:auto;">
            <table>
              <thead>
                <tr>
                  <th>Անուն</th>
                  <th>Էլ. Հասցե</th>
                  <th>Քարտի Համար</th>
                  <th>Գրանցման Ամսաթիվ</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Database error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

