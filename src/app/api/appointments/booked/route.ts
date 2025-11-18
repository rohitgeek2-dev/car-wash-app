import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

// GET booked times
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    const bookings = await prisma.appointment.findMany({
      where: { date }, // string YYYY-MM-DD
      select: { time: true },
    });

    const bookedTimes = bookings.map(b => {
      const [hourStr, minuteStr] = b.time.split(':');
      let hour = parseInt(hourStr);
      const minute = minuteStr || '00';
      const period = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 === 0 ? 12 : hour % 12;
      return `${hour.toString().padStart(2, '0')}:${minute} ${period}`;
    });

    return NextResponse.json({ bookedTimes });
  } catch (err) {
    console.error("Booked API Error:", err);
    return NextResponse.json({ error: "Failed to fetch booked slots" }, { status: 500 });
  }
}

// POST create appointment
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Convert date string to YYYY-MM-DD
    const appointmentData = {
      service: data.service,
      date: new Date(data.date).toISOString().split("T")[0], // ensures DateOnly string
      time: data.time,
      carType: data.carType,
      name: data.name,
      email: data.email,
      status: data.status || "Pending",
    };

    // Create appointment in DB
    let appointment;
    try {
      appointment = await prisma.appointment.create({ data: appointmentData });
    } catch (err: any) {
      if (err.code === "P2002") {
        return NextResponse.json(
          { error: "This time slot is already booked" },
          { status: 400 }
        );
      }
      throw err;
    }

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const htmlMessage = `
      <h3>New Booking Submission</h3>
      <p><strong>Service:</strong> ${data.service}</p>
      <p><strong>Date:</strong> ${appointmentData.date}</p>
      <p><strong>Time:</strong> ${data.time}</p>
      <p><strong>Car Type:</strong> ${data.carType}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Status:</strong> ${appointmentData.status}</p>
    `;

    await transporter.sendMail({
      from: `"Car Wash Booking" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: data.email,
      subject: "New Booking Form Submission",
      html: htmlMessage,
    });

    return NextResponse.json({ message: "Booking sent successfully", appointment }, { status: 200 });

  } catch (err) {
    console.error("Booking API Error:", err);
    return NextResponse.json({ error: "Booking not sent" }, { status: 500 });
  }
}
