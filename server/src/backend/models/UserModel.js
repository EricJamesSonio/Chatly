export default class User {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    return this.db.query("SELECT * FROM users");
  }

  getById(id) {
    return this.db.query("SELECT * FROM users WHERE id = ?", [id]);
  }

  create({
    name,
    birthdate,
    profile_image,
    cover_photo,
    location,
    hobbies,
    talents,
    facebook_url,
    tiktok_url,
    instagram_url,
  }) {
    return this.db.execute(
      `INSERT INTO users (name, birthdate, profile_image, cover_photo, location, hobbies, talents, facebook_url, tiktok_url, instagram_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        birthdate,
        profile_image,
        cover_photo,
        location,
        hobbies,
        talents,
        facebook_url,
        tiktok_url,
        instagram_url,
      ]
    );
  }

  update(
    id,
    {
      name,
      birthdate,
      profile_image,
      cover_photo,
      location,
      hobbies,
      talents,
      facebook_url,
      tiktok_url,
      instagram_url,
    }
  ) {
    return this.db.execute(
      `UPDATE users SET
        name = ?, birthdate = ?, profile_image = ?, cover_photo = ?, location = ?, hobbies = ?, talents = ?,
        facebook_url = ?, tiktok_url = ?, instagram_url = ?
       WHERE id = ?`,
      [
        name,
        birthdate,
        profile_image,
        cover_photo,
        location,
        hobbies,
        talents,
        facebook_url,
        tiktok_url,
        instagram_url,
        id,
      ]
    );
  }

  delete(id) {
    return this.db.execute("DELETE FROM users WHERE id = ?", [id]);
  }
}
