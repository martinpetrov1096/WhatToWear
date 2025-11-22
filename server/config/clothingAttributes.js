/**
 * Predefined clothing attributes for AI analysis
 * This centralizes all valid options for clothing categorization
 * Easy to expand with additional attributes like colors, sizes, etc.
 */

export const CLOTHING_ATTRIBUTES = {
  // Main clothing categories
  categories: [
    'tops',
    'bottoms',
    'dresses',
    'outerwear',
    'shoes',
    'accessories',
    'activewear',
    'sleepwear',
    'swimwear',
    'suits'
  ],

  // Add more attributes here as needed:
  // colors: ['black', 'white', 'red', 'blue', ...],
  // sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  // patterns: ['solid', 'striped', 'checkered', ...],
};

/**
 * Get formatted list for AI prompt
 */
export function getCategoriesForPrompt() {
  return CLOTHING_ATTRIBUTES.categories.map(c => `"${c}"`).join(', ');
}

/**
 * Validate if a category is in the predefined list
 */
export function isValidCategory(category) {
  return CLOTHING_ATTRIBUTES.categories.includes(category.toLowerCase());
}
