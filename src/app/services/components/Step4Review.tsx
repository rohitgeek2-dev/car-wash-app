'use client';
import React, { useState } from 'react';

interface FormData {
  service: string;
  date: string;
  time: string;
  carType: string;
  name: string;
  email: string;
}

interface Step4ReviewProps {
  data: FormData;
  setFormData: (data: FormData) => void;
  onEdit: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export default function Step4Review({
  data,
  setFormData,
  onEdit,
  onConfirm,
  isSubmitting,
}: Step4ReviewProps) {
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleConfirm = () => {
    if (!validateEmail(data.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    onConfirm();
  };

  return (
    <div className="step4-review-container">
      <h2 className="step4-title">Review Your Appointment</h2>

      <ul className="review-summary">
        <li><strong>Service:</strong> {data.service}</li>
        <li><strong>Date:</strong> {data.date}</li>
        <li><strong>Time:</strong> {data.time}</li>
        <li><strong>Car Type:</strong> {data.carType}</li>
      </ul>

      <div className="form-group">
        <label className="form-label">Your Name</label>
        <input
          type="text"
          className="form-control"
          value={data.name}
          onChange={(e) => setFormData({ ...data, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Your Email</label>
        <input
          type="email"
          className={`form-control ${emailError ? 'is-invalid' : ''}`}
          value={data.email}
          onChange={(e) => setFormData({ ...data, email: e.target.value })}
          required
        />
        {emailError && <small className="text-danger">{emailError}</small>}
      </div>

      <div className="review-actions">
        <button onClick={onEdit} className="btn btn-secondary">Edit</button> 
        <button
          onClick={handleConfirm}
          disabled={isSubmitting || !data.name || !data.email}
          className="btn btn-success"
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}
