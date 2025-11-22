import axios from 'axios';
import type {
  ClothingItem,
  WeatherData,
  WardrobeResponse,
  UploadResponse,
  OutfitResponse,
  ApiResponse
} from '../types';

const API_BASE_URL = '/api';

// Clothing API
export const uploadClothing = async (file: File): Promise<ClothingItem> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post<UploadResponse>(
    `${API_BASE_URL}/clothing/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to upload clothing');
  }

  return response.data.data;
};

export const getWardrobe = async (): Promise<WardrobeResponse> => {
  const response = await axios.get<WardrobeResponse>(`${API_BASE_URL}/clothing`);
  return response.data;
};

export const deleteClothing = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/clothing/${id}`);
};

// Weather API
export const getWeather = async (location?: string): Promise<ApiResponse<WeatherData>> => {
  const params = location ? { location } : {};
  const response = await axios.get<ApiResponse<WeatherData>>(
    `${API_BASE_URL}/weather`,
    { params }
  );
  return response.data;
};

// Outfit API
export const generateOutfit = async (
  location?: string,
  customPrompt?: string,
  tags?: string[]
): Promise<OutfitResponse> => {
  const response = await axios.post<OutfitResponse>(
    `${API_BASE_URL}/outfit/generate`,
    {
      location,
      customPrompt,
      tags
    }
  );
  return response.data;
};
