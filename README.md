# WhatToWear

An AI-powered clothing recommendation system that helps you decide what to wear based on your wardrobe and current weather conditions.

## Features

- **Smart Clothing Recognition**: Upload photos of your clothing items and let ChatGPT Vision API automatically categorize them (type, color, sleeve length, fit, etc.)
- **Weather-Aware Recommendations**: Get outfit suggestions based on current weather conditions
- **Simple Wardrobe Management**: All clothing data stored in a simple JSON file
- **Modern Tech Stack**: Built with React, Node.js, and OpenAI's latest APIs

## Tech Stack

### Backend
- Node.js + Express
- OpenAI SDK (ChatGPT Vision API)
- Weather API integration
- JSON file-based storage

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key
- Weather API key (OpenWeatherMap or WeatherAPI)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd WhatToWear
npm run install:all
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example server/.env
```

Edit `server/.env` and add your API keys:
- Get OpenAI API key from: https://platform.openai.com/
- Get Weather API key from: https://openweathermap.org/api

### 3. Run the Application

Development mode (runs both frontend and backend):
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend on `http://localhost:5173`

### 4. Using the Application

1. **Upload Clothing**: Navigate to the upload section and upload a photo of a clothing item
2. **View Wardrobe**: See all your categorized clothing items
3. **Get Outfit Recommendation**: Click to generate a weather-appropriate outfit suggestion

## Project Structure

```
WhatToWear/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API client
│   │   └── App.jsx      # Main app
│   └── package.json
├── server/              # Express backend
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── data/            # JSON storage
│   └── server.js        # Entry point
└── package.json         # Root workspace config
```

## API Endpoints

- `POST /api/clothing/upload` - Upload and analyze a clothing item
- `GET /api/clothing` - Get all clothing items
- `DELETE /api/clothing/:id` - Remove a clothing item
- `GET /api/outfit/generate` - Generate outfit recommendation
- `GET /api/weather` - Get current weather data

## API Costs

Note that using OpenAI's Vision API incurs costs:
- Image analysis: ~$0.01-0.03 per image
- Text generation: ~$0.002 per request

Monitor your usage at https://platform.openai.com/usage

## License

MIT
