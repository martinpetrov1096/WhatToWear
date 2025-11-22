/**
 * Predefined outfit description tags
 * These tags help users describe their style preferences for outfit generation
 */

export const OUTFIT_TAGS = [
  // Style & Aesthetic
  'casual',
  'professional',
  'minimalist',
  'bold',
  'edgy',
  'classic',
  'modern',
  'vintage',
  'bohemian',
  'preppy',
  'streetwear',
  'elegant',
  'sophisticated',
  'chic',
  'trendy',

  // Occasion
  'work',
  'date night',
  'brunch',
  'party',
  'formal event',
  'interview',
  'wedding',
  'gym',
  'travel',
  'everyday',

  // Vibe & Mood
  'comfortable',
  'relaxed',
  'polished',
  'confident',
  'playful',
  'romantic',
  'artistic',
  'sporty',
  'luxurious',
  'understated',

  // Color Preferences
  'monochrome',
  'colorful',
  'neutral tones',
  'earth tones',
  'pastels',
  'dark colors',
  'bright colors',

  // Fit & Style
  'fitted',
  'oversized',
  'layered',
  'sleek',
  'flowy',
  'structured',
  'loose'
];

/**
 * Get all outfit tags
 */
export function getAllTags() {
  return OUTFIT_TAGS;
}

/**
 * Format tags for display (capitalize first letter)
 */
export function formatTag(tag) {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}
