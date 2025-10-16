'use client';
import React from 'react';

interface Step3CarTypeProps {
  selected: string;
  onSelect: (carType: string) => void;
}

export default function Step3CarType({ selected, onSelect }: Step3CarTypeProps) {
  const types = ['SUV', 'Sedan', 'Hatchback', 'Coupe', 'Convertible'];

  return (
    <div className="step3-car-type-container">
      <h2 className="step3-title">Select Your Car Type</h2>
      <div className="car-type-options">
        {types.map((type) => (
          <div
            key={type}
            className={`car-type-card ${selected === type ? 'active' : ''}`}
            onClick={() => onSelect(type)}
          >
            {type}
          </div>
        ))}
      </div>
    </div>
  );
}
