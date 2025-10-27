export const seedFriendlist = async (db) => {
  const friendships = [
    [1, 2, 'accepted'],
    [1, 3, 'accepted'],
    [2, 4, 'accepted'],
    [3, 5, 'accepted'],
    [4, 6, 'pending'],
    [5, 1, 'pending']
  ];

  for (const [u, f, status] of friendships) {
    await db.execute(`
      INSERT INTO friendlist (user_id, friend_id, status)
      VALUES (?, ?, ?)
    `, [u, f, status]);
  }

  console.log('🌱 Seeded friendlist');
};
