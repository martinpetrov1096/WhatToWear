import express from 'express';
import { getCurrentWeather, getWeatherForecast } from '../services/weatherService.js';

const router = express.Router();

/**
 * GET /api/weather
 * Get current weather data
 * Query params: location (optional)
 */
router.get('/', async (req, res) => {
  try {
    const location = req.query.location;
    const weatherData = await getCurrentWeather(location);

    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({
      error: 'Failed to fetch weather data',
      message: error.message
    });
  }
});

/**
 * GET /api/weather/forecast
 * Get weather forecast for next 5 days
 * Query params: location (optional)
 */
router.get('/forecast', async (req, res) => {
  try {
    const location = req.query.location;
    const forecastData = await getWeatherForecast(location);

    res.json({
      success: true,
      data: forecastData
    });
  } catch (error) {
    console.error('Error fetching forecast:', error);
    res.status(500).json({
      error: 'Failed to fetch weather forecast',
      message: error.message
    });
  }
});

export default router;
