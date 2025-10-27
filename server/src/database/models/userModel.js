export const createUsersTable = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      birthdate DATE NOT NULL,
      profile_image VARCHAR(255) DEFAULT 'default.png',
      cover_photo VARCHAR(255) DEFAULT 'default-cover.jpg',
      location VARCHAR(100),
      hobbies TEXT,
      talents TEXT,
      facebook_url VARCHAR(255),
      tiktok_url VARCHAR(255),
      instagram_url VARCHAR(255)
    )
  `);
  console.log("🧩 users table created (with cover_photo)");
};
