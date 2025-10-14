// src/models/Appointment.ts
import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  service: String,
  date: String,
  time: String,
  carType: String,
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

export const Appointment =
  mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
