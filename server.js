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

// Աղյուսակի ստեղծում
pool.query(`
  CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    card_number VARCHAR(30) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error("Database error:", err));

// 1. Գլխավոր Էջ
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>nexuscard.am — Բացառիկ Անդամակցություն</title>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg-color: #060913;
          --card-bg: rgba(17, 24, 39, 0.7);
          --border-color: rgba(255, 255, 255, 0.08);
          --text-main: #f9fafb;
          --text-muted: #9ca3af;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background-color: var(--bg-color); color: var(--text-main); min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; }
        .container { width: 100%; max-width: 440px; }
        
        .logo-area { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: 700; letter-spacing: -0.5px; color: #fff; }
        .logo span { color: #818cf8; }
        .tagline { font-size: 13px; color: var(--text-muted); margin-top: 6px; }

        .glass-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 24px; padding: 35px; backdrop-filter: blur(20px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .form-title { font-size: 18px; font-weight: 600; margin-bottom: 6px; }
        .form-subtitle { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; line-height: 1.4; }
        
        .input-group { margin-bottom: 16px; }
        .input-group label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 6px; }
        .input-group input { width: 100%; padding: 14px 16px; background: rgba(3, 7, 18, 0.6); border: 1px solid var(--border-color); border-radius: 12px; color: #fff; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .input-group input:focus { border-color: #818cf8; }

        .btn-submit { width: 100%; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #fff; border: none; padding: 16px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; margin-top: 10px; }
        .btn-submit:hover { opacity: 0.9; }

        .admin-link { display: block; text-align: center; margin-top: 25px; font-size: 12px; color: var(--text-muted); text-decoration: none; }
        .admin-link:hover { color: #fff; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-area">
          <div class="logo">nexus<span>card.am</span></div>
          <div class="tagline">IDBank & Nexus Club Բացառիկ Համագործակցություն</div>
        </div>

        <div class="glass-card">
          <div class="form-title">Անդամակցության Ակտիվացում</div>
          <div class="form-subtitle">Լրացրեք տվյալները՝ 10% զեղչի քարտը ստանալու համար (8,000 AMD/ամիս):</div>
          
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
        </div>

        <a href="/admin" class="admin-link">Ադմինիստրատորի մուտք</a>
      </div>
    </body>
    </html>
  `);
});

// 2. Գրանցման Պրոցես և Սխալների Հստակ Մշակում
app.post('/register', async (req, res) => {
  const { name, email } = req.body;
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cardNumber = '5400 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000);

  try {
    // Փորձում ենք գրանցել նոր անդամին
    await pool.query('INSERT INTO members (name, email, card_number) VALUES ($1, $2, $3)', [name, cleanEmail, cardNumber]);
    
    // Հաջողված գրանցման էջ
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
          .success-title h2 { font-size: 22px; font-weight: 700; margin-bottom: 6px; color: #34d399; }
          .success-title p { font-size: 13px; color: #9ca3af; }

          .bank-card { background: linear-gradient(135deg, #111827 0%, #030712 100%); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 25px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); margin-bottom: 20px; position: relative; }
          .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
          .brand { font-size: 14px; font-weight: 700; letter-spacing: 1px; color: #fff; }
          .badge-idbank { font-size: 10px; background:
