import { db } from "../config/db.js";

export const getAllUsers = async () => {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
};

export const createUser = async (name, email) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  );
  return { id: result.insertId, name, email };
};

