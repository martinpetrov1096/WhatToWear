import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { analyzeClothingImage } from '../services/openaiService.js';
import { getAllClothing, addClothing, removeClothing, getClothingById } from '../services/wardrobeService.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'clothing-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
    }
  }
});

/**
 * POST /api/clothing/upload
 * Upload and analyze a clothing image
 */
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Analyzing clothing image:', req.file.filename);

    // Analyze the image using OpenAI
    const clothingData = await analyzeClothingImage(req.file.path);

    // Add image URL to the clothing data
    const urlPath = process.env.UPLOAD_URL_PATH || '/uploads';
    clothingData.imageUrl = `${urlPath}/${req.file.filename}`;

    // Add to wardrobe
    const savedItem = await addClothing(clothingData);

    console.log('Clothing item added to wardrobe:', savedItem.id);

    res.json({
      success: true,
      message: 'Clothing item analyzed and added to wardrobe',
      data: savedItem
    });
  } catch (error) {
    console.error('Error processing clothing upload:', error);
    res.status(500).json({
      error: 'Failed to process clothing item',
      message: error.message
    });
  }
});

/**
 * GET /api/clothing
 * Get all clothing items from wardrobe
 */
router.get('/', async (req, res) => {
  try {
    const wardrobe = await getAllClothing();
    res.json({
      success: true,
      count: wardrobe.length,
      data: wardrobe
    });
  } catch (error) {
    console.error('Error fetching wardrobe:', error);
    res.status(500).json({
      error: 'Failed to fetch wardrobe',
      message: error.message
    });
  }
});

/**
 * DELETE /api/clothing/:id
 * Remove a clothing item from wardrobe
 */
router.delete('/:id', async (req, res) => {
  try {
    // Get the clothing item first to find the image path
    const item = await getClothingById(req.params.id);

    // Remove from wardrobe
    const result = await removeClothing(req.params.id);

    // Delete the physical image file if it exists
    if (item && item.imageUrl) {
      const uploadDir = process.env.UPLOAD_DIR || './uploads';
      const filename = path.basename(item.imageUrl);
      const filepath = path.join(uploadDir, filename);

      fs.unlink(filepath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        } else {
          console.log('Deleted image file:', filename);
        }
      });
    }

    res.json({
      success: true,
      message: 'Clothing item removed from wardrobe',
      data: result
    });
  } catch (error) {
    console.error('Error removing clothing:', error);
    res.status(404).json({
      error: 'Failed to remove clothing item',
      message: error.message
    });
  }
});

export default router;
