import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables FIRST before any other imports
dotenv.config({ path: join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import clothingRoutes from './routes/clothing.js';
import outfitRoutes from './routes/outfit.js';
import weatherRoutes from './routes/weather.js';
import tagsRoutes from './routes/tags.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use(
  process.env.UPLOAD_URL_PATH || '/uploads',
  express.static(process.env.UPLOAD_DIR || './uploads')
);

// Routes
app.use('/api/clothing', clothingRoutes);
app.use('/api/outfit', outfitRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/tags', tagsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'WhatToWear API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
