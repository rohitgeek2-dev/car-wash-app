'use client';
import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Step2DateTime({ selectedDate, selectedTime, onSelect }) {
  const [date, setDate] = useState(selectedDate ? new Date(selectedDate) : null);
  const [time, setTime] = useState(selectedTime || '');
  const [error, setError] = useState('');

  // Generate time slots dynamically from 9 AM to 6 PM
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const ampm = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      slots.push(`${displayHour.toString().padStart(2, '0')}:00 ${ampm}`);
    }
    return slots;
  }, []);

  const handleSubmit = () => {
    if (!date || !time) {
      setError('Please select both a date and time.');
    } else {
      setError('');
      onSelect(date.toISOString().split('T')[0], time);
    }
  };

  // Disable weekends
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  return (
    <div className="step2-datetime-container">
      <h2 className="step2-title">Choose Your Date & Time</h2>

      <div className="form-group">
        <label className="form-label">Select Date</label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          filterDate={isWeekday}
          placeholderText="Select a date"
          className="form-control"
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
        />
      </div>

      <div className="form-group mt-3">
        <label className="form-label">Select Time</label>
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="form-select"
        >
          <option value="">Select a Time</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button onClick={handleSubmit} className="btn btn-primary mt-3">
        Next
      </button>
    </div>
  );
}
