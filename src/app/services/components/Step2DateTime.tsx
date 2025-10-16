'use client';
import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Step2DateTimeProps {
  selectedDate?: string;
  selectedTime?: string;
  onSelect: (date: string, time: string) => void;
}

export default function Step2DateTime({ selectedDate, selectedTime, onSelect }: Step2DateTimeProps) {
  const [date, setDate] = useState<Date | null>(selectedDate ? new Date(selectedDate) : null);
  const [time, setTime] = useState(selectedTime || '');
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Generate time slots dynamically from 9 AM to 6 PM
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      const ampm = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      slots.push(`${displayHour.toString().padStart(2, '0')}:00 ${ampm}`);
    }
    return slots;
  }, []);

  // Fetch booked slots whenever date changes
  useEffect(() => {
    if (!date) return;
    const formattedDate = date.toISOString().split('T')[0];
    fetch(`/api/appointments?date=${formattedDate}`)
      .then(res => res.json())
      .then((data) => setBookedSlots(data))
      .catch(err => console.error(err));
  }, [date]);

  const handleSubmit = () => {
    if (!date || !time) {
      setError('Please select both a date and time.');
    } else {
      setError('');
      onSelect(date.toISOString().split('T')[0], time);
    }
  };

  const isWeekday = (date: Date) => {
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
          onChange={(d) => setDate(d)}
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
            <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
              {slot} {bookedSlots.includes(slot) ? '(Booked)' : ''}
            </option>
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
