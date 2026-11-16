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

// Տվյալների բազայի ստեղծում (ներառյալ վճարման ստատուսը)
pool.query(`
  CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    card_number VARCHAR(30) UNIQUE,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error("Database error:", err));

// 1. Գլխավոր Էջ (Landing Page)
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
          --card-bg: rgba(17, 24, 39, 0.75);
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

        .links-area { display: flex; justify-content: space-between; margin-top: 25px; font-size: 12px; }
        .links-area a { color: var(--text-muted); text-decoration: none; }
        .links-area a:hover { color: #fff; }
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
          <div class="form-subtitle">Ստացեք 1
