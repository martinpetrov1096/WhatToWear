import { useState } from 'react';
import { deleteClothing } from '../services/api';
import type { ClothingCardProps } from '../types';

export default function ClothingCard({ item, onDelete }: ClothingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Remove this item from your wardrobe?')) return;

    try {
      setIsDeleting(true);
      await deleteClothing(item.id);
      onDelete(item.id);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete item');
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden transition-all hover:border-gray-300 relative group">
      {/* Delete Button - Top Right Corner */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100"
        title="Remove item"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Clothing Photo */}
      {item.imageUrl ? (
        <img
          src={`http://localhost:3001${item.imageUrl}`}
          alt={item.description}
          className="w-full h-56 object-cover"
        />
      ) : (
        <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-300 text-sm tracking-wide">No image</span>
        </div>
      )}

      {/* Card Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-light text-base capitalize tracking-wide text-gray-900 mb-1">
            {item.type}
          </h3>
          <p className="text-xs text-gray-400 tracking-wide line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="tag-dark text-xs">
            {item.color}
          </span>
          <span className="tag text-gray-600 text-xs">
            {item.pattern}
          </span>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs space-y-2 tracking-wide">
            <div className="flex justify-between">
              <span className="text-gray-400">Material</span>
              <span className="capitalize text-gray-700">{item.material}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fit</span>
              <span className="capitalize text-gray-700">{item.fit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Formality</span>
              <span className="capitalize text-gray-700">{item.formality}</span>
            </div>
            {item.sleeveLength !== 'N/A' && (
              <div className="flex justify-between">
                <span className="text-gray-400">Sleeves</span>
                <span className="capitalize text-gray-700">{item.sleeveLength}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Style</span>
              <span className="capitalize text-gray-700">{item.style}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Seasons</span>
              <span className="capitalize text-gray-700">{item.season.join(', ')}</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 w-full text-xs text-gray-400 hover:text-gray-700 transition-colors tracking-wider text-center py-1"
        >
          {isExpanded ? 'Show less' : 'Show details'}
        </button>
      </div>
    </div>
  );
}
