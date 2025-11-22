import express from 'express';
import { generateOutfitRecommendation } from '../services/openaiService.js';
import { getAllClothing } from '../services/wardrobeService.js';
import { getCurrentWeather } from '../services/weatherService.js';

const router = express.Router();

/**
 * GET /api/outfit/generate
 * Generate an outfit recommendation based on weather and available clothing
 * Query params: location (optional)
 */
router.get('/generate', async (req, res) => {
  try {
    const location = req.query.location;

    // Get current weather
    console.log('Fetching weather data...');
    const weatherData = await getCurrentWeather(location);

    // Get all available clothing
    console.log('Loading wardrobe...');
    const wardrobe = await getAllClothing();

    if (wardrobe.length === 0) {
      return res.status(400).json({
        error: 'Empty wardrobe',
        message: 'Please add some clothing items to your wardrobe first'
      });
    }

    // Generate outfit recommendation
    console.log('Generating outfit recommendation...');
    const recommendation = await generateOutfitRecommendation(weatherData, wardrobe);

    res.json({
      success: true,
      weather: weatherData,
      recommendation,
      wardrobeSize: wardrobe.length
    });
  } catch (error) {
    console.error('Error generating outfit:', error);
    res.status(500).json({
      error: 'Failed to generate outfit',
      message: error.message
    });
  }
});

/**
 * POST /api/outfit/generate
 * Generate outfit with custom prompt and style tags
 * Body: { location, customPrompt, tags }
 */
router.post('/generate', async (req, res) => {
  try {
    const { location, customPrompt, tags } = req.body;

    // Get weather and wardrobe
    console.log('Fetching weather data...');
    const weatherData = await getCurrentWeather(location);

    console.log('Loading wardrobe...');
    const wardrobe = await getAllClothing();

    if (wardrobe.length === 0) {
      return res.status(400).json({
        error: 'Empty wardrobe',
        message: 'Please add some clothing items to your wardrobe first'
      });
    }

    // Generate outfit recommendation with custom prompt and tags
    console.log('Generating outfit recommendation with preferences...');
    const recommendation = await generateOutfitRecommendation(
      weatherData,
      wardrobe,
      customPrompt,
      tags
    );

    res.json({
      success: true,
      weather: weatherData,
      recommendation,
      wardrobeSize: wardrobe.length
    });
  } catch (error) {
    console.error('Error generating custom outfit:', error);
    res.status(500).json({
      error: 'Failed to generate outfit',
      message: error.message
    });
  }
});

export default router;
