import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface FilterBarProps {
  genres: { id: number; name: string }[];
  onFilterChange: (genreId: number | null, minRating: number | null) => void;
}

const RATINGS = [
  { label: 'All Ratings', value: null },
  { label: '9+ ⭐', value: 9 },
  { label: '8+ ⭐', value: 8 },
  { label: '7+ ⭐', value: 7 },
];

const FilterBar: React.FC<FilterBarProps> = ({ genres, onFilterChange }) => {
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [activeRating, setActiveRating] = useState<number | null>(null);

  const handleGenre = (id: number | null) => {
    setActiveGenre(id);
    onFilterChange(id, activeRating);
  };

  const handleRating = (rating: number | null) => {
    setActiveRating(rating);
    onFilterChange(activeGenre, rating);
  };

  return (
    <div className="space-y-2 mb-5">
      {/* Genre pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button
          onClick={() => handleGenre(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeGenre === null
              ? 'bg-[#00a8e1] text-white'
              : 'bg-white/8 text-[#8197a4] border border-white/10 hover:text-white'
          }`}>
          All Genres
        </button>
        {genres.map(g => (
          <button
            key={g.id}
            onClick={() => handleGenre(g.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeGenre === g.id
                ? 'bg-[#00a8e1] text-white'
                : 'bg-white/8 text-[#8197a4] border border-white/10 hover:text-white'
            }`}>
            {g.name}
          </button>
        ))}
      </div>

      {/* Rating pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {RATINGS.map(r => (
          <button
            key={r.label}
            onClick={() => handleRating(r.value)}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeRating === r.value
                ? 'bg-[#f5c518] text-black font-semibold'
                : 'bg-white/8 text-[#8197a4] border border-white/10 hover:text-white'
            }`}>
            {r.value && <Star size={10} fill="currentColor" />}
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;