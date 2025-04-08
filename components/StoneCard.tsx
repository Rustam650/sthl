import React from 'react';
import Image from 'next/image';

interface StoneCardProps {
  image: string;
  title: string;
  description: string;
}

const StoneCard = ({ image, title, description }: StoneCardProps) => {
  return (
    <div className="w-[300px] h-[350px] bg-gray-900 rounded-lg overflow-hidden">
      <div className="relative w-[300px] h-[150px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-[#F3B942] text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default StoneCard;