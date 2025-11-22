import { useState, useEffect } from 'react';
import { generateOutfit } from '../services/api';
import axios from 'axios';
import type { OutfitGeneratorProps, OutfitRecommendation } from '../types';

export default function OutfitGenerator({ wardrobe, weather }: OutfitGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/tags');
        setAvailableTags(response.data.data || []);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);

      const response = await generateOutfit(weather?.location, customPrompt, selectedTags);
      setRecommendation(response.recommendation);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate outfit');
      console.error('Generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  if (wardrobe.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-light mb-3 tracking-wide">No clothes yet</h2>
        <p className="text-gray-400 tracking-wide">
          Add some clothing items to get outfit recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <h2 className="serif-heading text-3xl font-medium mb-3 tracking-tight">Ready for today?</h2>
        <p className="text-gray-500 mb-8 tracking-wide font-light">
          Let AI pick the perfect outfit based on weather and your wardrobe
        </p>

        {/* Custom Prompt & Tags */}
        <div className="max-w-2xl mx-auto mb-8 space-y-4 text-left">
          {/* Prompt Input */}
          <div>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Optional: Describe your style preferences (e.g., comfortable for a date night)"
              className="w-full px-4 py-3 border border-gray-200 rounded text-sm tracking-wide focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
          </div>

          {/* Tags Selector */}
          {availableTags.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 text-xs rounded border transition-all tracking-wide ${
                      selectedTags.includes(tag)
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary inline-flex items-center gap-2"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border border-gray-400 border-t-transparent"></div>
              Generating...
            </>
          ) : (
            <>
              Generate Outfit
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="card bg-red-50 border-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {recommendation && (
        <div className="space-y-6">
          {/* Outfit Items */}
          <div className="card">
            <h3 className="serif-heading text-xl font-medium mb-6 tracking-tight">Your Outfit for Today</h3>
            <div className="space-y-4">
              {recommendation.outfit.map((item, index) => {
                const clothingItem = wardrobe.find(c => c.id === item.id);
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-100 rounded overflow-hidden"
                  >
                    {/* Photo */}
                    {clothingItem?.imageUrl && (
                      <img
                        src={`http://localhost:3001${clothingItem.imageUrl}`}
                        alt={clothingItem.description}
                        className="w-24 h-24 object-cover rounded flex-shrink-0"
                      />
                    )}

                    <div className="flex-1">
                      <div className="font-light capitalize tracking-wide text-gray-900">
                        {clothingItem?.type || item.category}
                      </div>
                      {clothingItem && (
                        <div className="text-sm text-gray-500 mt-1 tracking-wide">
                          {clothingItem.color} · {clothingItem.pattern}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-2 tracking-wide">
                        {item.reason}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          <div className="card bg-gray-50 border-gray-100">
            <h4 className="font-light mb-3 tracking-wide text-gray-900">Why this outfit?</h4>
            <p className="text-sm text-gray-600 leading-relaxed tracking-wide">{recommendation.explanation}</p>
          </div>

          {/* Tips */}
          {recommendation.tips && recommendation.tips.length > 0 && (
            <div className="card">
              <h4 className="font-light mb-3 tracking-wide text-gray-900">Styling Tips</h4>
              <ul className="text-sm text-gray-600 space-y-2 leading-relaxed">
                {recommendation.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-gray-300 mt-0.5">—</span>
                    <span className="tracking-wide">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weather Badge */}
          <div className="text-center py-2">
            {recommendation.weatherAppropriate ? (
              <span className="inline-flex items-center gap-2 text-xs text-green-800 bg-green-50 border border-green-100 px-4 py-2 rounded tracking-wider">
                Weather appropriate
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-xs text-orange-800 bg-orange-50 border border-orange-100 px-4 py-2 rounded tracking-wider">
                Check weather conditions
              </span>
            )}
          </div>

          <button
            onClick={handleGenerate}
            className="btn-secondary w-full"
          >
            Generate Another Outfit
          </button>
        </div>
      )}
    </div>
  );
}
