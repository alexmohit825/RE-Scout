import React from 'react';
import { REGIONS } from '../data/properties';
import { RegionId } from '../types';

interface RegionSelectorProps {
  selected: RegionId;
  onSelect: (id: RegionId) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {REGIONS.map((region) => {
        const isSelected = selected === region.id;
        return (
          <button
            key={region.id}
            onClick={() => onSelect(region.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isSelected
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {region.label}
          </button>
        );
      })}
    </div>
  );
};
