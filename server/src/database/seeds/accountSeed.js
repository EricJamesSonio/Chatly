import bcrypt from 'bcrypt';

export const seedAccounts = async (db) => {
  const [users] = await db.query('SELECT id FROM users');
  const salt = await bcrypt.genSalt(10);

  const usernames = [
    'alice123',
    'bob123',
    'yellow123',
    'spongebob123',
    'red123',
    'patrick123'
  ];

  const data = await Promise.all(
    users.map(async (user, index) => [
      user.id,
      usernames[index],
      await bcrypt.hash('password123', salt) // ✅ same password for simplicity
    ])
  );

  for (const acc of data) {
    await db.execute(`
      INSERT INTO accounts (user_id, username, password)
      VALUES (?, ?, ?)
    `, acc);
  }

  console.log('🌱 Seeded accounts');
};
