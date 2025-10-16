'use client';
import React from 'react';

interface Step1ServiceTypeProps {
  selected: string;
  onSelect: (service: string) => void;
}

export default function Step1ServiceType({ selected, onSelect }: Step1ServiceTypeProps) {
  const services = ['Exterior Wash', 'Interior Detailing', 'Full Car Spa'];

  return (
    <div className="step1-service-container">
      <h2 className="step1-service-title">Choose a Car Wash Service</h2>
      <div className="step1-service-options pt-3">
        {services.map((service) => (
          <div
            key={service}
            className={`service-card ${selected === service ? 'active' : ''}`}
            onClick={() => onSelect(service)}
          >
            <span className="service-label">{service}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
