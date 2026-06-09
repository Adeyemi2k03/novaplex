import React from 'react';

export const MovieCardSkeleton: React.FC<{ index?: number }> = ({ index = 0 }) => (
  <div className="animate-pulse" style={{ animationDelay: `${index * 0.05}s` }}>
    <div className="rounded-xl bg-white/8 aspect-[2/3] w-full" />
    <div className="mt-2.5 space-y-2">
      <div className="h-3 bg-white/8 rounded w-3/4" />
      <div className="h-3 bg-white/8 rounded w-1/2" />
    </div>
  </div>
);

export const SkeletonGrid: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <MovieCardSkeleton key={i} index={i} />
    ))}
  </div>
);

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex justify-center items-center py-10">
      <div className={`${sizes[size]} border-2 border-[#00a8e1]/30 border-t-[#00a8e1] rounded-full animate-spin`} />
    </div>
  );
};

export default Spinner;