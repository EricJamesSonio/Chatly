import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ✅ Add SSL configuration for cloud DBs (PlanetScale, AWS, etc.)
const useSSL = process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('psdb.cloud');

export const db = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'chatly',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: useSSL ? { rejectUnauthorized: true } : undefined,
});

try {
  const conn = await db.getConnection();
  console.log('✅ Connected to MySQL Database');
  conn.release();
} catch (err) {
  console.error('❌ Database connection failed:', err.message);
  process.exit(1);
}
