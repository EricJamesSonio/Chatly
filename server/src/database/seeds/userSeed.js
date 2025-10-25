export const seedUsers = async (db) => {
  const users = [
    ['Alice', '2000-05-01', 'alice.png', 'Manila', 'Reading, Singing', 'Dancing', 'https://facebook.com/alice', 'https://tiktok.com/@alice', 'https://instagram.com/alice'],
    ['Bob', '1999-07-10', 'bob.png', 'Cebu', 'Gaming, Coding', 'Drawing', 'https://facebook.com/bob', 'https://tiktok.com/@bob', 'https://instagram.com/bob']
  ];

  for (const user of users) {
    await db.execute(`
      INSERT INTO users (name, birthdate, profile_image, location, hobbies, talents, facebook_url, tiktok_url, instagram_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, user);
  }

  console.log('🌱 Seeded users');
};
