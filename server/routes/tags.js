import express from 'express';
import { getAllTags } from '../config/tags.js';

const router = express.Router();

/**
 * GET /api/tags
 * Get all available outfit description tags
 */
router.get('/', async (req, res) => {
  try {
    const tags = getAllTags();
    res.json({
      success: true,
      count: tags.length,
      data: tags
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      error: 'Failed to fetch tags',
      message: error.message
    });
  }
});

export default router;
