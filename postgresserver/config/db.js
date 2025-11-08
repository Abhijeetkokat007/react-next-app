// // config/db.js
// import pkg from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();
// const { Pool } = pkg;

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// pool.on('connect', () => {
//   console.log('✅ Connected to PostgreSQL');
// });

// export default pool;


// config/db.js
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 🟢 Listen for successful connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

// 🔴 Listen for connection errors
pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err.message);
});

export default pool;
