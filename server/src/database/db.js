import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// ✅ Log to verify environment variables are loaded
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

// ✅ SSL options using ca.pem in server/
const sslOptions = { ca: fs.readFileSync(path.resolve(__dirname, '../../ca.pem')) };

// ✅ Create MySQL pool
export const db = await mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslOptions,
});

// ✅ Test the connection
try {
  const conn = await db.getConnection();
  console.log('✅ Connected to MySQL Database');
  conn.release();
} catch (err) {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
}
