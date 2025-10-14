// src/app/services/page.tsx
'use client';

import { useState } from 'react';
import Step1ServiceType from './components/Step1ServiceType';
import Step2DateTime from './components/Step2DateTime';
import Step3CarType from './components/Step3CarType';
import Step4Review from './components/Step4Review';
import './services.css';

export default function ServicesPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    carType: '',
    name: '',
    email: '',
  });

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConfirm = async () => {
    if (isSubmitting) return; // prevent double click
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'Pending' }),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Appointment Confirmed!');
      } else {
        alert(result.error || 'Failed to confirm appointment.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      {step === 1 && (
        <Step1ServiceType
          selected={formData.service}
          onSelect={(val) => {
            setFormData({ ...formData, service: val });
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <Step2DateTime
          selectedDate={formData.date}
          selectedTime={formData.time}
          onSelect={(date, time) => {
            setFormData({ ...formData, date, time });
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <Step3CarType
          selected={formData.carType}
          onSelect={(type) => {
            setFormData({ ...formData, carType: type });
            setStep(4);
          }}
        />
      )}

      {step === 4 && (
        <Step4Review
          data={formData}
          setFormData={setFormData} // lift name/email state up
          onConfirm={handleConfirm}
          isSubmitting={isSubmitting}
          onEdit={() => setStep(1)}
        />
      )}

      {step > 1 && step < 4 && (
        <div className="mt-4">
          <button className="btn btn-secondary" onClick={handleBack}>
            Back
          </button>
        </div>
      )}
    </div>
  );
}
