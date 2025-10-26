export const seedFriendlist = async (db) => {
  await db.execute(`
    INSERT INTO friendlist (user_id, friend_id, status)
    VALUES (1, 2, 'accepted')
  `);
  console.log('🌱 Seeded friendlist');
};
