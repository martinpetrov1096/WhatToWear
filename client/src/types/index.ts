// Clothing item structure
export interface ClothingItem {
  id: string;
  addedAt: string;
  category: string;
  type: string;
  color: string;
  secondaryColors?: string[];
  pattern: string;
  material: string;
  sleeveLength: string;
  fit: string;
  formality: string;
  season: string[];
  weatherSuitability: string[];
  style: string;
  description: string;
  imageUrl?: string;
}

// Weather data structure
export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  timestamp: string;
}

// Outfit recommendation structure
export interface OutfitItem {
  id: string;
  category: string;
  reason: string;
}

export interface OutfitRecommendation {
  outfit: OutfitItem[];
  explanation: string;
  weatherAppropriate: boolean;
  tips: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface WardrobeResponse extends ApiResponse<ClothingItem[]> {
  count?: number;
}

export interface UploadResponse extends ApiResponse<ClothingItem> {
  message: string;
}

export interface OutfitResponse extends ApiResponse<OutfitRecommendation> {
  weather: WeatherData;
  recommendation: OutfitRecommendation;
  wardrobeSize: number;
}

// Component props types
export interface UploadFormProps {
  onSuccess: (item: ClothingItem) => void;
}

export interface WardrobeListProps {
  wardrobe: ClothingItem[];
  onDelete: (itemId: string) => void;
  onRefresh: () => void;
}

export interface ClothingCardProps {
  item: ClothingItem;
  onDelete: (itemId: string) => void;
}

export interface OutfitGeneratorProps {
  wardrobe: ClothingItem[];
  weather: WeatherData | null;
}

export interface WeatherDisplayProps {
  weather: WeatherData;
}
