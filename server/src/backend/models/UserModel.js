export default class User {
  constructor(db) {
    this.db = db;
  }

  // Get all users
  getAll() {
    return this.db.query("SELECT * FROM users");
  }

  // Get user by ID
  getById(id) {
    return this.db.query("SELECT * FROM users WHERE id = ?", [id]);
  }

  // Create new user
  create({ name, birthdate, profile_image, location, hobbies, talents, facebook_url, tiktok_url, instagram_url }) {
    return this.db.execute(
      `INSERT INTO users (name, birthdate, profile_image, location, hobbies, talents, facebook_url, tiktok_url, instagram_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, birthdate, profile_image, location, hobbies, talents, facebook_url, tiktok_url, instagram_url]
    );
  }

  // Update user
  update(id, { name, birthdate, profile_image, location, hobbies, talents, facebook_url, tiktok_url, instagram_url }) {
    return this.db.execute(
      `UPDATE users SET
        name = ?, birthdate = ?, profile_image = ?, location = ?, hobbies = ?, talents = ?,
        facebook_url = ?, tiktok_url = ?, instagram_url = ?
       WHERE id = ?`,
      [name, birthdate, profile_image, location, hobbies, talents, facebook_url, tiktok_url, instagram_url, id]
    );
  }

  // Delete user
  delete(id) {
    return this.db.execute("DELETE FROM users WHERE id = ?", [id]);
  }
}
