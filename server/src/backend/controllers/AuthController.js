import bcrypt from "bcrypt";
import Account from "../models/AccountModel.js";
import { db } from "../../database/db.js";

const accountModel = new Account(db);

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute("SELECT * FROM accounts WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    res.json({ user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const signup = async (req, res) => {
  const { user_id, username, password } = req.body;
  try {
    const [existing] = await db.execute("SELECT id FROM accounts WHERE username = ?", [username]);
    if (existing.length > 0) return res.status(400).json({ message: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await accountModel.create({ user_id, username, password: hashed });

    res.status(201).json({ user: { username }, message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
