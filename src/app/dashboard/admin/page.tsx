'use client';
import { useEffect, useState } from 'react';

// Define the appointment type
interface Appointment {
  service: string;
  date: string;
  time: string;
  carType: string;
  status: string;
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const data: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
    setAppointments(data);
  }, []);

  const updateStatus = (index: number, status: string) => {
    const updated = [...appointments];
    updated[index].status = status;
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
  };

  return (
    <div className="container py-5">
      <h2>All Appointments</h2>
      {appointments.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Car Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((b: Appointment, i: number) => (
              <tr key={i}>
                <td>{b.service}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.carType}</td>
                <td>{b.status}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => updateStatus(i, 'Approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => updateStatus(i, 'Rejected')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
