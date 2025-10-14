'use client';
import React, { useState } from 'react';

interface AdminAppointmentProps {
  appointmentId: number;
  currentStatus: string;
  onStatusChange: (newStatus: string) => void; // parent callback
}

export default function AdminAppointment({
  appointmentId,
  currentStatus,
  onStatusChange,
}: AdminAppointmentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (isLoading || newStatus === currentStatus) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/appointments/updateStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, newStatus }),
      });

      const result = await res.json();

      if (res.ok) {
        onStatusChange(newStatus); // update parent state
      } else {
        alert(result.error || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex gap-1"> 
      <button
        className="btn btn-sm btn-primary"
        onClick={() => handleStatusChange('Confirmed')}
        disabled={isLoading || currentStatus === 'Confirmed'}
      >
        Confirm
      </button>
      <button
        className="btn btn-sm btn-danger"
        onClick={() => handleStatusChange('Rejected')}
        disabled={isLoading || currentStatus === 'Rejected'}
      >
        Rejected
      </button>
      <button
        className="btn btn-sm btn-success"
        onClick={() => handleStatusChange('Completed')}
        disabled={isLoading || currentStatus === 'Completed'}
      >
        Completed
      </button>
    </div>
  );
}
