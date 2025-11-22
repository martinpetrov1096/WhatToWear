import { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import WardrobeList from './components/WardrobeList';
import OutfitGenerator from './components/OutfitGenerator';
import WeatherDisplay from './components/WeatherDisplay';
import { getWardrobe, getWeather } from './services/api';
import type { ClothingItem, WeatherData } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'wardrobe' | 'outfit'>('outfit');
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load wardrobe and weather independently so one failure doesn't block the other
      const wardrobePromise = getWardrobe().catch(err => {
        console.error('Error loading wardrobe:', err);
        return { data: [] };
      });

      const weatherPromise = getWeather().catch(err => {
        console.error('Error loading weather:', err);
        return { data: null };
      });

      const [wardrobeData, weatherData] = await Promise.all([
        wardrobePromise,
        weatherPromise
      ]);

      setWardrobe(wardrobeData.data || []);
      setWeather(weatherData.data || null);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newItem: ClothingItem) => {
    setWardrobe([...wardrobe, newItem]);
  };

  const handleDeleteItem = (itemId: string) => {
    setWardrobe(wardrobe.filter(item => item.id !== itemId));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="serif-heading text-4xl font-medium text-center tracking-wider">
            WhatToWear
          </h1>
        </div>
      </header>

      {/* Weather Banner */}
      {weather && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <WeatherDisplay weather={weather} />
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="sticky top-[89px] z-40 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 text-sm font-light tracking-wider transition-all ${
                activeTab === 'upload'
                  ? 'text-black border-b border-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`py-4 text-sm font-light tracking-wider transition-all ${
                activeTab === 'wardrobe'
                  ? 'text-black border-b border-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Wardrobe <span className="text-xs">({wardrobe.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('outfit')}
              className={`py-4 text-sm font-light tracking-wider transition-all ${
                activeTab === 'outfit'
                  ? 'text-black border-b border-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Get Outfit
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border border-gray-300 border-t-gray-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'upload' && (
              <UploadForm onSuccess={handleUploadSuccess} />
            )}
            {activeTab === 'wardrobe' && (
              <WardrobeList
                wardrobe={wardrobe}
                onDelete={handleDeleteItem}
                onRefresh={loadData}
              />
            )}
            {activeTab === 'outfit' && (
              <OutfitGenerator
                wardrobe={wardrobe}
                weather={weather}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
