// scripts/setupDB.js
import fs from 'fs';
import pool from '../config/db.js';

const runSQL = async (filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  await pool.query(sql);
  console.log(`✅ Executed: ${filePath}`);
};

const setupDB = async () => {
  try {
    await runSQL('sql/schema.sql'); // create tables
    await runSQL('sql/seed.sql');   // insert sample data
    console.log('🎉 Database setup complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database setup failed:', err.message);
    process.exit(1);
  }
};

setupDB();
