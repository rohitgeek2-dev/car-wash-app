'use client';
import React from 'react';

export default function Step4Review({ data, setFormData, onEdit, onConfirm, isSubmitting }) {
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
          className="form-control"
          value={data.email}
          onChange={(e) => setFormData({ ...data, email: e.target.value })}
          required
        />
      </div>

      <div className="review-actions">
        <button onClick={onEdit} className="btn btn-secondary">Edit</button>
        <button
          onClick={onConfirm}
          disabled={isSubmitting || !data.name || !data.email}
          className="btn btn-success"
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}
