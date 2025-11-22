import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WARDROBE_FILE = path.join(__dirname, '../data/wardrobe.json');

/**
 * Initialize wardrobe file if it doesn't exist
 */
async function initializeWardrobe() {
  try {
    await fs.access(WARDROBE_FILE);
  } catch {
    // File doesn't exist, create it with empty array
    await fs.writeFile(WARDROBE_FILE, JSON.stringify([], null, 2));
  }
}

/**
 * Read all clothing items from the wardrobe
 */
export async function getAllClothing() {
  await initializeWardrobe();
  const data = await fs.readFile(WARDROBE_FILE, 'utf-8');
  return JSON.parse(data);
}

/**
 * Add a new clothing item to the wardrobe
 */
export async function addClothing(clothingData) {
  const wardrobe = await getAllClothing();

  const newItem = {
    id: Date.now().toString(),
    addedAt: new Date().toISOString(),
    ...clothingData
  };

  wardrobe.push(newItem);
  await fs.writeFile(WARDROBE_FILE, JSON.stringify(wardrobe, null, 2));

  return newItem;
}

/**
 * Get a single clothing item by ID
 */
export async function getClothingById(id) {
  const wardrobe = await getAllClothing();
  return wardrobe.find(item => item.id === id);
}

/**
 * Remove a clothing item by ID
 */
export async function removeClothing(id) {
  const wardrobe = await getAllClothing();
  const filtered = wardrobe.filter(item => item.id !== id);

  if (filtered.length === wardrobe.length) {
    throw new Error('Clothing item not found');
  }

  await fs.writeFile(WARDROBE_FILE, JSON.stringify(filtered, null, 2));
  return { success: true, id };
}

/**
 * Get clothing items by category
 */
export async function getClothingByCategory(category) {
  const wardrobe = await getAllClothing();
  return wardrobe.filter(item =>
    item.category?.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get clothing items suitable for weather conditions
 */
export async function getClothingForWeather(weatherConditions) {
  const wardrobe = await getAllClothing();
  const { temperature, condition } = weatherConditions;

  // Simple filtering logic - can be enhanced
  return wardrobe.filter(item => {
    if (temperature < 50 && item.sleeveLength === 'long sleeve') return true;
    if (temperature > 70 && item.sleeveLength === 'short sleeve') return true;
    if (temperature >= 50 && temperature <= 70) return true;
    return false;
  });
}
