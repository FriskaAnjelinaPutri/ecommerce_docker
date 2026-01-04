// backend/user-service/server.js
require('dotenv').config({ path: '.env' });

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 4000;

/* =========================
   DEBUG ENV (AMAN DIHAPUS)
   ========================= */
console.log('DB USER:', process.env.USER_DB_USER);
console.log('DB PASSWORD:', process.env.USER_DB_PASSWORD ? 'OK' : 'UNDEFINED');
console.log('DB NAME:', process.env.USER_DB_NAME);

/* =========================
   CORS
   ========================= */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

/* =========================
   BODY PARSER
   ========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   POSTGRES CONFIG
   ========================= */
const pool = new Pool({
  host: process.env.DB_HOST,       // user-db
  port: process.env.DB_PORT,       // 5432
  user: process.env.DB_USER,       // postgres
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,   // userdb
});

/* =========================
   TEST DB CONNECTION
   ========================= */
pool.query('SELECT 1')
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch(err => {
    console.error('❌ PostgreSQL error:', err.message);
    process.exit(1);
  });

/* =========================
   ROUTES
   ========================= */

// ROOT
app.get('/', (req, res) => {
  res.json({ success: true, message: 'User Service is running' });
});

/* ---------- READ ALL ---------- */
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users ORDER BY id'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------- READ BY ID ---------- */
app.get('/users/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------- CREATE ---------- */
app.post('/users', async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({
      success: false,
      message: 'name, email, role wajib diisi',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, role)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, role]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------- UPDATE ---------- */
app.put('/users/:id', async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({
      success: false,
      message: 'name, email, role wajib diisi',
    });
  }

  try {
    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2, role = $3
       WHERE id = $4
       RETURNING *`,
      [name, email, role, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------- DELETE ---------- */
app.delete('/users/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted',
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   START SERVER
   ========================= */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 User service running on port ${PORT}`);
});
