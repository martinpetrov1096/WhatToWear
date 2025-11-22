import OpenAI from 'openai';
import fs from 'fs/promises';
import { getCategoriesForPrompt } from '../config/clothingAttributes.js';

// Lazy initialization of OpenAI client to ensure env vars are loaded
let openai = null;
function getOpenAIClient() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
}

/**
 * Analyze a clothing image using ChatGPT Vision API
 * @param {string} imagePath - Path to the uploaded image
 * @returns {Object} Structured clothing data
 */
export async function analyzeClothingImage(imagePath) {
  try {
    // Read the image file and convert to base64
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const imageType = imagePath.endsWith('.png') ? 'png' : 'jpeg';

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this clothing item and provide a detailed JSON categorization.

              Please identify:
              - category: Must be one of: ${getCategoriesForPrompt()}. Choose the single most appropriate category.
              - type: (more specific type, e.g., "t-shirt", "button-up", "jeans", "sneakers")
              - color: (primary color or colors)
              - secondaryColors: (array of additional colors if any)
              - pattern: (e.g., "solid", "striped", "checkered", "floral", "graphic")
              - material: (e.g., "cotton", "denim", "leather", "synthetic")
              - sleeveLength: (for tops: "sleeveless", "short sleeve", "3/4 sleeve", "long sleeve", or "N/A")
              - fit: (e.g., "tight", "fitted", "regular", "loose", "oversized")
              - formality: (e.g., "casual", "business casual", "formal", "athletic")
              - season: (array of suitable seasons: "spring", "summer", "fall", "winter")
              - weatherSuitability: (array: "hot", "warm", "cool", "cold", "rainy")
              - style: (e.g., "minimalist", "streetwear", "preppy", "bohemian", "athletic")
              - description: (brief 1-2 sentence description)

              Return ONLY valid JSON with these exact field names. Do not include any other text.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/${imageType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const analysisText = response.choices[0].message.content;

    // Parse the JSON response
    // Remove markdown code blocks if present
    const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) ||
                      analysisText.match(/```\n([\s\S]*?)\n```/);
    const jsonText = jsonMatch ? jsonMatch[1] : analysisText;

    const clothingData = JSON.parse(jsonText.trim());

    // Keep the uploaded image for display (no longer deleting)
    return clothingData;
  } catch (error) {
    // Clean up the image file even if there's an error
    try {
      await fs.unlink(imagePath);
    } catch {}

    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}

/**
 * Generate outfit recommendation based on weather and available clothing
 * @param {Object} weatherData - Current weather information
 * @param {Array} availableClothing - Array of clothing items from wardrobe
 * @param {String} customPrompt - Optional user preferences description
 * @param {Array} tags - Optional style tags selected by user
 * @returns {Object} Outfit recommendation
 */
export async function generateOutfitRecommendation(weatherData, availableClothing, customPrompt, tags) {
  try {
    // Build user preferences section
    let userPreferences = '';
    if (customPrompt || (tags && tags.length > 0)) {
      userPreferences = '\n    User Preferences:';
      if (customPrompt) {
        userPreferences += `\n    - Custom request: ${customPrompt}`;
      }
      if (tags && tags.length > 0) {
        userPreferences += `\n    - Style tags: ${tags.join(', ')}`;
      }
      userPreferences += '\n';
    }

    const prompt = `Based on the following weather conditions and available clothing items,
    suggest a complete outfit.

    Weather:
    - Temperature: ${weatherData.temperature}°F
    - Condition: ${weatherData.condition}
    - Description: ${weatherData.description}
${userPreferences}
    Available Clothing (${availableClothing.length} items):
    ${JSON.stringify(availableClothing, null, 2)}

    Please recommend:
    1. A complete outfit using items from the wardrobe (reference items by their ID)
    2. Explain why this outfit is suitable for the weather${userPreferences ? ' and user preferences' : ''}
    3. Suggest any accessories or additional items if needed

    Return a JSON object with this structure:
    {
      "outfit": [
        { "id": "item_id", "category": "category_name", "reason": "why this item" }
      ],
      "explanation": "overall explanation of the outfit choice",
      "weatherAppropriate": true/false,
      "tips": ["tip 1", "tip 2"]
    }

    Return ONLY valid JSON, no other text.`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a fashion advisor who helps people dress appropriately for the weather. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000
    });

    const recommendationText = response.choices[0].message.content;

    // Parse JSON response
    const jsonMatch = recommendationText.match(/```json\n([\s\S]*?)\n```/) ||
                      recommendationText.match(/```\n([\s\S]*?)\n```/);
    const jsonText = jsonMatch ? jsonMatch[1] : recommendationText;

    return JSON.parse(jsonText.trim());
  } catch (error) {
    throw new Error(`Failed to generate outfit recommendation: ${error.message}`);
  }
}
