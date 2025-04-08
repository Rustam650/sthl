import React from 'react';
import StoneCard from './StoneCard';

interface Stone {
  id: string | number;
  name: string;
  description: string;
  image?: string;
  images?: string[];
  image_url?: string;
  price?: string | number;
  type?: string;
}

interface StonesListProps {
  stones: Stone[];
}

const StonesList: React.FC<StonesListProps> = ({ stones }) => {
  if (!stones || stones.length === 0) {
    return <div className="text-center py-10">Камни не найдены</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      {stones.map((stone) => (
        <StoneCard
          key={stone.id}
          stone={stone}
        />
      ))}
    </div>
  );
};

export default StonesList;
