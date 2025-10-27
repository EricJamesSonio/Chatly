import User from "../models/UserModel.js";
import { db } from "../../database/db.js";

const userModel = new User(db);

// ✅ Get all users
export const getUsers = async (req, res) => {
  try {
    const [rows] = await userModel.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get user by ID
export const getUserById = async (req, res) => {
  try {
    const [rows] = await userModel.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ msg: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create user
export const createUser = async (req, res) => {
  try {
    await userModel.create(req.body);
    res.status(201).json({ msg: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update user
export const updateUser = async (req, res) => {
  try {
    await userModel.update(req.params.id, req.body);
    res.json({ msg: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    await userModel.delete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
