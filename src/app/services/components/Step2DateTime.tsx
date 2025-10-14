'use client';
import React, { useState } from 'react';

export default function Step2DateTime({ selectedDate, selectedTime, onSelect }) {
  const [date, setDate] = useState(selectedDate || '');
  const [time, setTime] = useState(selectedTime || '');
  const [error, setError] = useState('');

  const isWeekend = (dateStr) => {
    const day = new Date(dateStr).getDay();
    return day === 0 || day === 6;
  };

  const handleSubmit = () => {
    if (!date || !time) {
      setError('Please select both a date and time.');
    } else if (isWeekend(date)) {
      setError('We do not accept bookings on weekends. Please select a weekday.');
    } else {
      setError('');
      onSelect(date, time);
    }
  };

  return (
    <div className="step2-datetime-container">
      <h2 className="step2-title">Choose Your Date & Time</h2>

      <div className="form-group">
        <label className="form-label">Select Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Select Time</label>
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="form-select"
        >
          <option value="">Select a Time</option>
          <option>09:00 AM</option>
          <option>11:00 AM</option>
          <option>01:00 PM</option>
          <option>03:00 PM</option>
          <option>05:00 PM</option>
        </select>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button onClick={handleSubmit} className="btn btn-primary mt-3">
        Next
      </button>
    </div>
  );
}
