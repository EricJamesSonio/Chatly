import express from 'express';
import cors from 'cors';
import { db } from './database/db.js';
import friendlistRoutes from './backend/routes/FriendListRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/friends', friendlistRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('✅ Server is running');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
