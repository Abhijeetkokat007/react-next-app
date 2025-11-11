import { getAllUsers, createUser } from "../models/userModel.js";

export const fetchUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await createUser(name, email);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const healthCheck = (req, res) => {
  res.send("Server is running smoothly.");

};
