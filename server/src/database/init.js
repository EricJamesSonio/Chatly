import { db } from './db.js';
import { createUsersTable } from './models/userModel.js';
import { createAccountsTable } from './models/accountModel.js';
import { createFriendlistTable } from './models/friendlistModel.js';
import { createMessagesTable } from './models/messageModel.js';
import { seedUsers } from './seeds/userSeed.js';
import { seedAccounts } from './seeds/accountSeed.js';
import { seedFriendlist } from './seeds/friendlistSeed.js';
import { seedMessages } from './seeds/messageSeed.js';

const initDatabase = async () => {
  try {
    console.log('🚀 Initializing CHATLY Database...');
    await createUsersTable(db);
    await createAccountsTable(db);
    await createFriendlistTable(db);
    await createMessagesTable(db);

    console.log('✅ Tables created! Now seeding...');
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
