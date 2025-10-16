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

export default function UserDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const data: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
    setAppointments(data);
  }, []);

  return (
    <div className="container py-5">
      <h2>Your Bookings</h2>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
