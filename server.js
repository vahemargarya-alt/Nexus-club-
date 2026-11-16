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
              <input type="text" name="name" placeholder="Օր. Վ
