export default class Account {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    return this.db.query("SELECT * FROM accounts");
  }

  getById(id) {
    return this.db.query("SELECT * FROM accounts WHERE id = ?", [id]);
  }

  create({ user_id, username, password }) {
    return this.db.execute(
      "INSERT INTO accounts (user_id, username, password) VALUES (?, ?, ?)",
      [user_id, username, password]
    );
  }

  update(id, { username, password }) {
    return this.db.execute(
      "UPDATE accounts SET username = ?, password = ? WHERE id = ?",
      [username, password, id]
    );
  }

  delete(id) {
    return this.db.execute("DELETE FROM accounts WHERE id = ?", [id]);
  }
}
