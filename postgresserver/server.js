// // server.js
// require('dotenv').config();
// const express = require('express');
// const app = express();

// const usersRouter = require('./routes/users');

// app.use(express.json());

// // health
// app.get('/health', (req, res) => res.json({ ok: true, time: new Date() }));

// // api routes
// app.use('/api/users', usersRouter);

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });


// server.js
import express from 'express';
import dotenv from 'dotenv';
import personRoutes from './routes/personRoutes.js';
import pool from './config/db.js'; // 🟢 Import DB connection

dotenv.config();

const app = express();
app.use(express.json());

// Default route
app.get('/', (req, res) => res.send('API is running... 🚀'));

// Person routes
app.use('/api/person', personRoutes);

// 🧠 Optional: test DB connection on startup
(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL at', result.rows[0].now);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
})();

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
