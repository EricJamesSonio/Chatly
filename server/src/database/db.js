import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Enable SSL for Aiven or other cloud MySQL providers
const useSSL =
  process.env.DB_SSL === 'true' ||
  process.env.DB_HOST?.includes('aivencloud.com');

export const db = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'chatly',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: useSSL ? { rejectUnauthorized: true } : undefined, // ✅ Required for Aiven
});

// Test the connection
try {
  const conn = await db.getConnection();
  console.log('✅ Connected to MySQL Database');
  conn.release();
} catch (err) {
  console.error('❌ Database connection failed:', err.message);
  process.exit(1);
}
