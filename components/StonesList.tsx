import React from 'react';
import StoneCard from './StoneCard';

interface Stone {
  id: string;
  name: string;
  description: string;
  image: string;
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
          image={stone.image}
          title={stone.name}
          description={stone.description}
        />
      ))}
    </div>
  );
};

export default StonesList;
