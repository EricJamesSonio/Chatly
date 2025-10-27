import bcrypt from "bcrypt";
import Account from "../models/AccountModel.js";
import { db } from "../../database/db.js";

const accountModel = new Account(db);

export const getAccounts = async (req, res) => {
  try {
    const [rows] = await accountModel.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAccountById = async (req, res) => {
  try {
    const [rows] = await accountModel.getById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ msg: "Not found" });
  
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    const { user_id, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await accountModel.create({ user_id, username, password: hashedPassword });
    res.status(201).json({ msg: "Account created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await accountModel.update(req.params.id, { username, password: hashed });
    res.json({ msg: "Account updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await accountModel.delete(req.params.id);
    res.json({ msg: "Account deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
