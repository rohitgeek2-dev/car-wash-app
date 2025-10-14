'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('appointments') || '[]');
    setAppointments(data);
  }, []);

  const updateStatus = (index, status) => {
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
            {appointments.map((b, i) => (
              <tr key={i}>
                <td>{b.service}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.carType}</td>
                <td>{b.status}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => updateStatus(i, 'Approved')}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(i, 'Rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
