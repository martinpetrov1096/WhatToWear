import ClothingCard from './ClothingCard';
import type { WardrobeListProps } from '../types';

export default function WardrobeList({ wardrobe, onDelete, onRefresh }: WardrobeListProps) {
  if (wardrobe.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-light mb-3 tracking-wide">Your wardrobe is empty</h2>
        <p className="text-gray-400 tracking-wide">
          Start by uploading some clothing items
        </p>
      </div>
    );
  }

  // Group by category
  const categories = wardrobe.reduce((acc, item) => {
    const category = item.category.toLowerCase();
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof wardrobe>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="serif-heading text-2xl font-medium tracking-tight">
          Your Wardrobe
          <span className="text-sm text-gray-400 ml-3 font-sans font-light tracking-wide">
            {wardrobe.length} {wardrobe.length === 1 ? 'item' : 'items'}
          </span>
        </h2>
        <button
          onClick={onRefresh}
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors tracking-wider"
        >
          Refresh
        </button>
      </div>

      {Object.entries(categories).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-xs font-light text-gray-500 uppercase tracking-widest mb-4">
            {category} ({items.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
