import bcrypt from 'bcrypt';

export const seedAccounts = async (db) => {
  const users = await db.query('SELECT id FROM users');
  const salt = await bcrypt.genSalt(10);

  const data = [
    [users[0][0].id, 'alice123', await bcrypt.hash('password123', salt)],
    [users[0][1].id, 'bob321', await bcrypt.hash('securepass', salt)]
  ];

  for (const acc of data) {
    await db.execute(`
      INSERT INTO accounts (user_id, username, password)
      VALUES (?, ?, ?)
    `, acc);
  }

  console.log('🌱 Seeded accounts');
};
