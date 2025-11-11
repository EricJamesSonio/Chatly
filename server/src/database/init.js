import { db } from './db.js';
import { createUsersTable } from './models/userModel.js';
import { createAccountsTable } from './models/accountModel.js';
import { createFriendlistTable } from './models/friendlistModel.js';
import { createMessagesTable } from './models/messageModel.js';
import { createPostsTable } from './models/postModel.js';
import { createCommentsTable } from './models/commentModel.js';

import { seedUsers } from './seeds/userSeed.js';
import { seedAccounts } from './seeds/accountSeed.js';
import { seedFriendlist } from './seeds/friendlistSeed.js';
import { seedMessages } from './seeds/messageSeed.js';

const dropTables = async () => {
  await db.execute('SET FOREIGN_KEY_CHECKS = 0'); // disable FK checks temporarily

  const tables = ['comments', 'posts', 'messages', 'friendlist', 'accounts', 'users'];
  for (const table of tables) {
    await db.execute(`DROP TABLE IF EXISTS ${table}`);
    console.log(`🗑️ Dropped table if exists: ${table}`);
  }

  await db.execute('SET FOREIGN_KEY_CHECKS = 1'); // re-enable FK checks
};

const initDatabase = async () => {
  try {
    console.log('🚀 Initializing CHATLY Database...');

    // Safely drop existing tables first
    await dropTables();

    // Recreate tables
    await createUsersTable(db);
    await createAccountsTable(db);
    await createFriendlistTable(db);
    await createMessagesTable(db);
    await createPostsTable(db);
    await createCommentsTable(db);

    console.log('✅ Tables created! Now seeding...');

    // Seed data
    await seedUsers(db);
    await seedAccounts(db);
    await seedFriendlist(db);
    await seedMessages(db);

    console.log('🎉 Database setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error initializing DB:', err);
    process.exit(1);
  }
};

initDatabase();
