export const seedMessages = async (db) => {
  await db.execute(`
    INSERT INTO messages (sender_id, receiver_id, message)
    VALUES 
    (1, 2, 'Hey Bob! How are you?'),
    (2, 1, 'Hey Alice! Doing great, you?')
  `);
  console.log('🌱 Seeded messages');
};
