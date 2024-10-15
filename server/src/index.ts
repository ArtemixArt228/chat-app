import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

import routes from './routes/api.route';

import { setupSocketIO } from './socket';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/api/chat/src/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/chat', routes);

// MongoDB connection
const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/chat';

mongoose.connect(MONGODB_URL)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    });

const httpServer = createServer(app);

// Socket.IO Setup
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// Initialize Socket.IO with best practices
setupSocketIO(io);

// Health check route
app.get('/api', (_, res) => {
    res.status(200).json({ message: 'Hello world' });
});

// Start HTTP server
httpServer.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
