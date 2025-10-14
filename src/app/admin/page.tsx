'use client';
import React, { useEffect, useState } from 'react';
import AdminAppointment from './AdminAppointment';

interface Appointment {
  id: number;
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
  carType: string;
  status: string;
}

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointments/list'); // fetch all appointments from DB
        const data = await res.json();
        setAppointments(data.appointments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) return <p>Loading appointments...</p>;
  if (appointments.length === 0) return <p>No appointments found.</p>;

  return (
    <div className="container py-5">
      <h1>Admin Dashboard</h1>
      <table className="table table-bordered table-striped mt-3">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Client</th>
            <th>Email</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Car Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {appointments.map((appt) => (
            <tr
            key={appt.id}
            className={selectedId === appt.id ? 'table-primary' : ''}
            >
            <td>
                <input
                type="checkbox"
                checked={selectedId === appt.id}
                onChange={() =>
                    setSelectedId(selectedId === appt.id ? null : appt.id)
                }
                onClick={(e) => e.stopPropagation()}
                />
            </td><td>{appt.id}</td><td>{appt.name}</td><td>{appt.email}</td><td>{appt.service}</td><td>{appt.date}</td><td>{appt.time}</td><td>{appt.carType}</td><td>{appt.status}</td><td>
                {selectedId === appt.id && (
                <AdminAppointment
                    appointmentId={appt.id}
                    currentStatus={appt.status}
                    onStatusChange={(newStatus) => {
                    setAppointments((prev) =>
                        prev.map((a) =>
                        a.id === appt.id ? { ...a, status: newStatus } : a
                        )
                    );
                    }}
                />
                )}
            </td>
            </tr>
        ))}
        </tbody>

      </table>
    </div>
  );
}
