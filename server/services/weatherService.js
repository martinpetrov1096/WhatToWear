import axios from 'axios';

/**
 * Get current weather data from OpenWeatherMap API
 * @param {string} location - City name or zip code
 * @returns {Object} Weather data
 */
export async function getCurrentWeather(location) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('Weather API key not configured');
  }

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: location || process.env.DEFAULT_LOCATION || 'New York',
        appid: apiKey,
        units: 'imperial' // Fahrenheit
      }
    });

    const data = response.data;

    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    if (error.response) {
      throw new Error(`Weather API error: ${error.response.data.message}`);
    }
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
}

/**
 * Get weather forecast for the next few days
 * @param {string} location - City name or zip code
 * @returns {Array} Forecast data
 */
export async function getWeatherForecast(location) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('Weather API key not configured');
  }

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        q: location || process.env.DEFAULT_LOCATION || 'New York',
        appid: apiKey,
        units: 'imperial'
      }
    });

    // Process forecast data - get one reading per day
    const dailyForecasts = {};

    response.data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          temperature: Math.round(item.main.temp),
          condition: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        };
      }
    });

    return Object.values(dailyForecasts).slice(0, 5); // Next 5 days
  } catch (error) {
    throw new Error(`Failed to fetch forecast: ${error.message}`);
  }
}
