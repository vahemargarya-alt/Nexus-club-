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

// 1. Գլխավոր էջ (Շքեղ, ինֆորմատիվ և բազմաշերտ նորարարական Լենդինգ)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nexus Club - Կորպորատիվ բարեկեցության նոր ձևաչափ</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background: #070b12; color: #f8fafc; overflow-x: hidden; }
        
        /* Header / Nav */
        header { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: rgba(13, 19, 33, 0.85); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); position: sticky; top: 0; z-index: 1000; }
        .logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #ffd700; letter-spacing: 1px; }
        .nav-links a { color: #94a3b8; text-decoration: none; font-size: 14px; font-weight: 500; margin-left: 20px; transition: color 0.2s; }
        .nav-links a:hover { color: #ffd700; }

        /* Hero Section */
        .hero { padding: 60px 20px; text-align: center; background: radial-gradient(circle at center, #131c2e 0%, #070b12 70%); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: #fff; margin-bottom: 16px; line-height: 1.3; }
        .hero h1 span { color: #ffd700; }
        .hero p { color: #94a3b8; font-size: 16px; max-width: 600px; margin: 0 auto 30px auto; line-height: 1.6; }

        /* Partners Bar */
        .partners { display: flex; justify-content: center; gap: 30px; padding: 20px; background: #0b111e; border-bottom: 1px solid rgba(255,255,255,0.05); color: #64748b; font-size: 14px; font-weight: 600; flex-wrap: wrap; text-transform: uppercase; letter-spacing: 1px; }
        .partners span { color: #cbd5e1; }

        /* Content Sections */
        .container { max-width: 1000px; margin: 0 auto; padding: 50px 20px; }
        .grid-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 50px; }
        .feature-box { background: #131c2e; border: 1px solid rgba(255, 255, 255, 0.08); padding: 30px; border-radius: 16px; transition: transform 0.3s, border-color 0.3s; }
        .feature-box:hover { transform: translateY(-4px); border-color: rgba(255, 215, 0, 0.3); }
        .feature-box h3 { font-size: 18px; color: #ffd700; margin-bottom: 10px; font-weight: 600; }
        .feature-box p { font-size: 14px; color: #94a3b8; line-height: 1.5; }

        /* Registration Form Section */
        .reg-section { background: linear-gradient(135deg, #131c2e 0%, #0a101d 100%); border: 1px solid rgba(255, 215, 0, 0.2); padding: 40px; border-radius: 20px; max-width: 500px; margin: 0 auto 60px auto; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
        .reg-section h2 { font-family: 'Playfair Display', serif; font-size: 26px; color: #ffd700; margin-bottom: 10px; text-align: center; }
        .reg-section p.sub { font-size: 14px; color: #94a3b8; text-align: center; margin-bottom: 25px; }
        .form-group { margin-bottom: 18px; }
        label { display: block; font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 6px; }
        input { width: 100%; padding: 14px 16px; background: #070b12; border: 1px solid #334155; border-radius: 10px; color: #fff; font-size: 15px; outline: none; }
        input:focus { border-color: #ffd700; box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.15); }
        button { width: 100%; margin-top: 10px; background: linear-gradient(90deg, #b8860b 0%, #ffd700 100%); color: #070b12; border: none; padding: 16px; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; transition: opacity 0.2s; }
        button:hover { opacity: 0.9; }

        /* Footer */
        footer { text-align: center; padding: 30px; background: #05080e; color: #64748b; font-size: 13px; border-top: 1px solid rgba(255,255,255,0.05); }
      </style>
    </head>
    <body>

      <header>
        <div class="logo">Nexus Club</div>
        <div class="nav-links">
          <a href="/admin">Ադմին Մուտք</a>
        </div>
      </header>

      <section class="hero">
        <h1>Կորպորատիվ բարեկեցության<br><span>նոր ձևաչափ</span></h1>
        <p>Գրանցվե՛ք ընդամենը 8,000 դրամ/ամիս և ստացեք բացառիկ 10% զեղչ Yerevan City և MG սուպերմարկետներում։ Սա տեխնոլոգիական նորարարություն է ձեր առօրյայի համար։</p>
      </section>

      <div class="partners">
        <span>Idram</span>
        <span>IDBank</span>
        <span>EasyPay</span>
        <span>Yerevan City</span>
        <span>MG Market</span>
      </div>

      <div class="container">
        <div class="grid-features">
          <div class="feature-box">
            <h3>💎 Բացառիկ Արտոնություններ</h3>
            <p>Անդամակցեք փակ համայնքին և խնայեք ձեր բյուջեն ամենօրյա գնումների ժամանակ:</p>
          </div>
          <div class="feature-box">
            <h3>⚡ Անմիջապես Թվային Քարտ</h3>
            <p>Գրանցվելուն պես ստացեք ձեր անհատական Nexus Card-ը՝ ակտիվ կարգավիճակով:</p>
          </div>
          <div class="feature-box">
            <h3>🔒 Անվտանգության Բարձր Մակարդակ</h3>
            <p>Ձեր տվյալները պաշտպանված են բանկային ստանդարտներին համապատասխան:</p>
          </div>
        </div>

        <div class="reg-section" id="register">
          <h2>Միացե՛ք Nexus Club-ին</h2>
          <p class="sub">Լրացրեք տվյալները և ստացեք ձեր թվային անդամաքարտը</p>
          <form action="/register" method="POST">
            <div class="form-group">
              <label>Անուն Ազգանուն</label>
              <input type="text" name="name" placeholder="Օր. Վահե Մարգարյան" required />
            </div>
            <div class="form-group">
              <label>Էլ. Հասցե (Email)</label>
              <input type="email" name="email" placeholder="example@gmail.com" required />
            </div>
            <button type="submit">Ստանալ Nexus Card</button>
          </form>
        </div>
      </div>

      <footer>
        <p>© 2026 Nexus Club Technologies. Բոլոր իրավունքները պաշտպանված են։</p>
      </footer>

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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background: #070b12; min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; padding: 20px; }
          .container { width: 100%; max-width: 420px; }
          .card-nexus { background: linear-gradient(135deg, #1e293b 0%, #070b12 100%); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 20px; padding: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.7); position: relative; }
          .brand { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; letter-spacing: 2px; color: #ffd700; text-transform: uppercase; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
          .status-badge { background: rgba(52, 211, 153, 0.15); color: #34d399; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; border: 1px solid rgba(52, 211, 153, 0.3); }
          .member-name { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 6px; }
          .member-email { font-size: 13px; color: #94a3b8; margin-bottom: 25px; }
          .perks { background: rgba(11, 17, 30, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); padding: 18px; border-radius: 12px; margin-bottom: 25px; }
          .perks p { font-size: 14px; color: #cbd5e1; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
          .perks p:last-child { margin-bottom: 0; }
          .perks b { color: #ffd700; }
          .footer-note { text-align: center; font-size: 12px; color: #64748b; line-height: 1.4; }
          .btn-home { display: block; text-align: center; margin-top: 20px; background: #131c2e; color: #e2e8f0; text-decoration: none; padding: 14px; border-radius: 10px; font-size: 14px; font-weight: 600; border: 1px solid rgba(255,255,255,0.1); transition: background 0.2s; }
          .btn-home:hover { background: #1e293b; }
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
              <p>🛍️ <b>10% Զեղչ</b> Yerevan City-ում</p>
              <p>🛒 <b>10% Զեղչ</b> MG սուպերմարկետում</p>
              <p>💎 <b>Անդամավճար:</b> 8,000 AMD / ամիս</p>
            </div>

            <div class="footer-note">Սա տեխնոլոգիական նորարարություն է։ Ցույց տվեք այս քարտը կասսայում զեղչից օգտվելու համար։</div>
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
        <title>Սխալ</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background: #070b12; min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; padding: 20px; }
          .card { background: #131c2e; border: 1px solid rgba(239, 68, 68, 0.3); padding: 40px; border-radius: 20px; width: 100%; max-width: 400px; text-align: center; }
          h2 { color: #ef4444; font-size: 24px; margin-bottom: 12px; }
          p { color: #94a3b8; font-size: 14px; margin-bottom: 24px; }
          a { background: #ef4444; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; display: inline-block; }
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Login - Nexus Club</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background: #070b12; min-height: 100vh; display: flex; justify-content: center; align-items: center; color: #f8fafc; padding: 20px; }
        .card { background: #131c2e; border: 1px solid rgba(255, 215, 0, 0.2); padding: 40px; border-radius: 20px; width: 100%; max-width: 380px; text-align: center; }
        h2 { font-family: 'Playfair Display', serif; font-size: 24px; color: #ffd700; margin-bottom: 10px; }
        p.subtitle { color: #94a3b8; font-size: 13px; margin-bottom: 20px; }
        .form-group { margin-bottom: 16px; text-align: left; }
        input { width: 100%; padding: 14px 16px; background: #070b12; border: 1px solid #334155; border-radius: 10px; color: #fff; font-size: 15px; outline: none; }
        button { width: 100%; background: linear-gradient(90deg, #b8860b 0%, #ffd700 100%); color: #070b12; border: none; padding: 14px; border-radius: 10px; cursor: pointer; font-size: 15px; font-weight: 700; text-transform: uppercase; }
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Սխալ գաղտնաբառ</title>
        <style>
          body { background: #070b12; color: #fff; font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; padding: 20px; }
          .error-box { text-align: center; background: #131c2e; padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); }
          h2 { color: #ef4444; margin-bottom: 10px; }
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
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 14px 16px; color: #fff; font-weight: 500;">${m.name}</td>
            <td style="padding: 14px 16px; color: #94a3b8;">${m.email}</td>
            <td style="padding: 14px 16px; color: #64748b; font-size: 13px;">${new Date(m.created_at).toLocaleString()}</td>
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
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
          body { background: #070b12; min-height: 100vh; padding: 40px 20px; color: #f8fafc; }
          .container { max-width: 850px; margin: 0 auto; background: #131c2e; border: 1px solid rgba(255, 215, 0, 0.2); padding: 30px; border-radius: 20px; box-shadow: 0 30px 60px rgba(0,0,0,0.7); }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
          h2 { font-family: 'Playfair Display', serif; font-size: 24px; color: #ffd700; }
          a.back-btn { background: #070b12; color: #e2e8f0; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; border: 1px solid rgba(255,255,255,0.1); }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { background: #070b12; color: #cbd5e1; padding: 14px 16px; font-size: 13px; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.1); text-transform: uppercase; }
          .badge { background: rgba(52, 211, 153, 0.15); color: #34d399; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Ադմին Վահանակ <span class="badge">SECURE</span></h2>
            <a href="/admin" class="back-btn">Ելք (Log out)</a>
          </div>
          <p style="color: #94a3b8; font-size: 14px; margin-bottom: 25px;">Այս էջում պահպանվում են բոլոր գրանցված անդամների տվյալները։</p>
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
