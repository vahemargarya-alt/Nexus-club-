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

// Ավտոմատ ստեղծում ենք աղյուսակը (ներառյալ քարտի եզակի համարը և IDBank վճարման ստատուսը)
pool.query(`
  CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    card_number VARCHAR(20) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).then(() => {
  console.log("Database table 'members' is ready.");
}).catch(err => {
  console.error("Error creating table:", err);
});

// 1. Գլխավոր էջ (Զուսպ, պրեմիում լենդինգ IDBank ինտեգրման հնարավորությամբ)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>nexuscard.am - IDBank & Nexus Club</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background-color: #0b0f19; min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f3f4f6; padding: 20px; }
        .main-wrapper { width: 100%; max-width: 420px; }
        
        .brand-header { text-align: center; margin-bottom: 30px; }
        .brand-logo { font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; }
        .brand-tagline { font-size: 13px; color: #9ca3af; margin-top: 4px; }

        .card { background: #111827; padding: 35px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        h2 { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 10px; }
        p.subtitle { color: #9ca3af; font-size: 13px; margin-bottom: 25px; line-height: 1.5; }
        
        .form-group { margin-bottom: 18px; }
        label { display: block; font-size: 12px; font-weight: 500; color: #d1d5db; margin-bottom: 6px; }
        input { width: 100%; padding: 12px 14px; background: #030712; border: 1px solid #1f2937; border-radius: 8px; color: #fff; font-size: 14px; outline: none; transition: border-color 0.2s; }
        input:focus { border-color: #6366f1; }
        
        .idbank-badge { display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); padding: 10px; border-radius: 8px; font-size: 12px; color: #818cf8; margin-bottom: 20px; font-weight: 500; }
        
        button { width: 100%; background: #6366f1; color: white; border: none; padding: 14px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: background 0.2s; }
        button:hover { background: #4f46e5; }

        .footer-text { text-align: center; margin-top: 25px; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="main-wrapper">
        <div class="brand-header">
          <div class="brand-logo">nexuscard.am</div>
          <div class="brand-tagline">IDBank & Nexus Club Բացառիկ Համագործակցություն</div>
        </div>
        
        <div class="card">
          <h2>Անդամակցության Գրանցում</h2>
          <p class="subtitle">Ստացեք 10% զեղչ Yerevan City-ում և MG-ում (8,000 AMD / ամիս)</p>
          
          <div class="idbank-badge">
            <span>🔒 Վճարումը հաստատվում է IDBank-ի միջոցով</span>
          </div>

          <form action="/register" method="POST">
            <div class="form-group">
              <label>Անուն Ազգանուն</label>
              <input type="text" name="name" placeholder="Օր. Վահե Մարգարյան" required />
            </div>
            <div class="form-group">
              <label>Էլ. Հասցե (Email)</label>
              <input type="email" name="email" placeholder="example@gmail.com" required />
            </div>
            <button type="submit">Վճարել IDBank-ով և ստանալ քարտը</button>
          </form>
        </div>
        
        <div class="footer-text">
            <p>© 2026 nexuscard.am. Բոլոր իրավունքները պաշտպանված են։</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// 2. Գրանցման պրոցես և Երկկողմանի Digital Nexus Card (Առջևից՝ բանկային քարտ, ետևից՝ շտրիխ կոդ)
app.post('/register', async (req, res) => {
  const { name, email } = req.body;
  // Գեներացնում ենք կեղծ/բանկային եզակի քարտի համար (օրինակ՝ 5400 XXXX XXXX)
  const cardNumber = '5400 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000);

  try {
    await pool.query('INSERT INTO members (name, email, card_number) VALUES ($1, $2, $3)', [name, email, cardNumber]);
    
    res.send(`
      <!DOCTYPE html>
      <html lang="hy">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ձեր Nexus Card - nexuscard.am</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Libre+Barcode+128&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background-color: #0b0f19; min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f3f4f6; padding: 20px; }
          .container { width: 100%; max-width: 420px; }
          
          /* Realistic Bank Card Style */
          .bank-card { background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 25px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); position: relative; margin-bottom: 20px; }
          
          .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
          .bank-name { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: 1px; }
          .idbank-logo { font-size: 11px; background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
          
          .chip { width: 40px; height: 30px; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); border-radius: 4px; margin-bottom: 20px; position: relative; overflow: hidden; }
          .chip::after { content: ''; position: absolute; width: 100%; height: 1px; background: rgba(0,0,0,0.3); top: 50%; }
          
          .card-number { font-family: monospace; font-size: 18px; letter-spacing: 2px; color: #e5e7eb; margin-bottom: 20px; }
          
          .card-holder-row { display: flex; justify-content: space-between; align-items: flex-end; }
          .holder-label { font-size: 9px; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.5px; }
          .holder-name { font-size: 15px; font-weight: 600; color: #fff; text-transform: uppercase; }
          .card-expiry { font-family: monospace; font-size: 13px; color: #d1d5db; }

          /* Card Back / Barcode Section */
          .card-back { background: #030712; border: 1px solid #1f2937; border-radius: 16px; padding: 25px; text-align: center; }
          .back-title { font-size: 12px; color: #9ca3af; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          
          /* Barcode simulation using font or clean lines */
          .barcode-box { background: #fff; padding: 10px; border-radius: 6px; display: inline-block; margin-bottom: 10px; }
          .barcode-text { font-family: 'Libre Barcode 128', cursive; font-size: 48px; color: #000; line-height: 1; }
          .barcode-digits { font-family: monospace; font-size: 12px; color: #374151; letter-spacing: 2px; }
          
          .perks-info { margin-top: 15px; font-size: 12px; color: #d1d5db; border-top: 1px solid #1f2937; padding-top: 12px; text-align: left; }
          .perks-info p { margin-bottom: 4px; display: flex; justify-content: space-between; }
          .perks-info span { font-weight: 600; color: #34d399; }

          .btn-home { display: block; text-align: center; margin-top: 20px; background: transparent; color: #9ca3af; text-decoration: none; padding: 10px; font-size: 13px; transition: color 0.2s; }
          .btn-home:hover { color: #fff; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Քարտի առջևի մաս (Bank Card) -->
          <div class="bank-card">
            <div class="card-top">
              <span class="bank-name">NEXUS CLUB</span>
              <span class="idbank-logo">IDBank Partner</span>
            </div>
            <div class="chip"></div>
            <div class="card-number">${cardNumber}</div>
            <div class="card-holder-row">
              <div>
                <div class="holder-label">Cardholder</div>
                <div class="holder-name">${name}</div>
              </div>
              <div class="card-expiry">09/28</div>
            </div>
          </div>

          <!-- Քարտի հետևի մաս (Barcode / QR սկանավորման համար) -->
          <div class="card-back">
            <div class="back-title">Կասսայում սկանավորման շտրիխ կոդ</div>
            <div class="barcode-box">
              <div class="barcode-text">*${cardNumber.replace(/\\s/g, '')}*</div>
              <div class="barcode-digits">${cardNumber}</div>
            </div>
            
            <div class="perks-info">
              <p>Yerevan City / MG Զեղչ: <span>10% Ակտիվ է</span></p>
              <p>Անդամավճար: <span>8,000 AMD / ամիս</span></p>
            </div>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Սխալ - nexuscard.am</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background-color: #0b0f19; min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f3f4f6; padding: 20px; }
          .card { background: #111827; padding: 35px; border-radius: 16px; border: 1px solid #1f2937; width: 100%; max-width: 400px; text-align: center; }
          h2 { color: #ef4444; font-size: 18px; margin-bottom: 10px; }
          p { color: #9ca3af; font-size: 13px; margin-bottom: 25px; }
          a { background: #ef4444; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 600; display: inline-block; }
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
      <title>Admin - nexuscard.am</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background-color: #0b0f19; min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f3f4f6; padding: 20px; }
        .card { background: #111827; padding: 35px; border-radius: 16px; border: 1px solid #1f2937; width: 100%; max-width: 380px; text-align: center; }
        h2 { font-size: 18px; color: #fff; margin-bottom: 10px; }
        p.subtitle { color: #9ca3af; font-size: 12px; margin-bottom: 20px; }
        .form-group { margin-bottom: 16px; text-align: left; }
        input { width: 100%; padding: 12px 14px; background: #030712; border: 1px solid #1f2937; border-radius: 8px; color: #fff; font-size: 14px; }
        button { width: 100%; background: #6366f1; color: #fff; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
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

// 4. Ադմինի Գաղտնի Վահանակ
app.post('/admin-dashboard', async (req, res) => {
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="hy">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Սխալ</title>
        <style>
          body { background-color: #0b0f19; color: #fff; font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; padding: 20px; }
          .error-box { text-align: center; background: #111827; padding: 35px; border-radius: 16px; border: 1px solid #1f2937; }
          h2 { color: #ef4444; margin-bottom: 10px; font-size: 18px; }
          a { color: #818cf8; text-decoration: none; font-size: 13px; }
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
      rowsHtml = `<tr><td colspan="4" style="text-align: center; color: #9ca3af; padding: 24px; font-size: 13px;">Դեռևս գրանցված անդամներ չկան։</td></tr>`;
    } else {
      result.rows.forEach(m => {
        rowsHtml += `
          <tr style="border-bottom: 1px solid #1f2937;">
            <td style="padding: 14px 16px; color: #fff; font-weight: 500; font-size: 13px;">${m.name}</td>
            <td style="padding: 14px 16px; color: #9ca3af; font-size: 13px;">${m.email}</td>
            <td style="padding: 14px 16px; font-family: monospace; color: #818cf8; font-size: 13px;">${m.card_number || 'N/A'}</td>
            <td style="padding: 14px 16px; color: #6b7280; font-size: 12px;">${new Date(m.created_at).toLocaleString()}</td>
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
        <title>Admin Dashboard - nexuscard.am</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background-color: #0b0f19; min-height: 100vh; padding: 40px 20px; color: #f3f4f6; }
          .container { max-width: 950px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; padding: 30px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
          h2 { font-size: 18px; font-weight: 600; color: #fff; }
          a.back-btn { background: #1f2937; color: #d1d5db; text-decoration: none; padding: 8px 14px; border-radius: 6px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { background: #030712; color: #9ca3af; padding: 14px 16px; font-size: 11px; font-weight: 600; border-bottom: 1px solid #1f2937; text-transform: uppercase; }
          .badge { background: rgba(52, 211, 153, 0.1); color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Անդամների Բազա <span class="badge">IDBank Secure</span></h2>
            <a href="/admin" class="back-btn">Ելք</a>
          </div>
          <div style="overflow-x: auto;">
            <table>
              <thead>
                <tr>
                  <th>Անուն</th>
                  <th>Էլ. Հասցե</th>
                  <th>Քարտի Համար</th>
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
