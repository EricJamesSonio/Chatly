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

const initDatabase = async () => {
  try {
    console.log('🚀 Initializing CHATLY Database...');

    // Existing tables
    await createUsersTable(db);
    await createAccountsTable(db);
    await createFriendlistTable(db);
    await createMessagesTable(db);

    // New tables
    await createPostsTable(db);
    await createCommentsTable(db);

    console.log('✅ Tables created! Now seeding...');

    // Existing seeds
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
