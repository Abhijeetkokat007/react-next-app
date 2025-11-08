// models/personModel.js
import pool from '../config/db.js';

export const getAllPersons = async () => {
  const result = await pool.query('SELECT * FROM personDB ORDER BY id ASC');
  return result.rows;
};

export const addPerson = async (name, city) => {
  const result = await pool.query(
    'INSERT INTO personDB (name, city) VALUES ($1, $2) RETURNING *',
    [name, city]
  );
  return result.rows[0];
};
