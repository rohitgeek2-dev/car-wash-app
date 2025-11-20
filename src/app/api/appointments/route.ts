import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

// 🔥 Fix timezone: Convert "2025-12-01" → "2025-12-01T12:00:00"
function toLocalNoon(dateString: string) {
  const d = new Date(dateString);
  d.setHours(12, 0, 0, 0); // Set time to noon to avoid UTC shifting
  return d;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("📥 Incoming booking data:", data);

    // ------------------------------
    // ✅ FIXED DATE (No more 1-day earlier)
    // ------------------------------
   const appointmentData = {
      service: data.service,
      date: String(data.date).split("T")[0],  // FIXED
      time: data.time,
      carType: data.carType,
      name: data.name,
      email: data.email,
      status: data.status || "Pending",
    };


    let appointment;

    // ------------------------------
    // ✅ DATABASE SAVE
    // ------------------------------
    try {
      appointment = await prisma.appointment.create({
        data: appointmentData,
      });
    } catch (err: any) {
      console.error("🔥 Prisma create error:", err);

      return NextResponse.json(
        { error: "Database error", details: err.message },
        { status: 500 }
      );
    }

    // ------------------------------
    // ✅ EMAIL NOTIFICATION
    // ------------------------------
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"Car Wash Booking" <${process.env.GMAIL_USER}>`,
        to: `${process.env.GMAIL_USER}, ${appointmentData.email}`, // admin + user
        replyTo: appointmentData.email,
        subject: "Booking Confirmation",
        html: `
          <h2>Your Booking is Confirmed</h2>
          <p><strong>Service:</strong> ${appointmentData.service}</p>
          <p><strong>Date:</strong> ${appointmentData.date.toDateString()}</p>
          <p><strong>Time:</strong> ${appointmentData.time}</p>
          <p><strong>Car Type:</strong> ${appointmentData.carType}</p>
          <p><strong>Name:</strong> ${appointmentData.name}</p>
          <p><strong>Email:</strong> ${appointmentData.email}</p>
        `,
      });
    } catch (emailErr) {
      console.error("📧 Email sending error:", emailErr);
    }

    // ------------------------------
    // ✅ SUCCESS RESPONSE
    // ------------------------------
    return NextResponse.json(
      { message: "Booking sent successfully", appointment },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("❌ GLOBAL API Error:", err);
    return NextResponse.json(
      { error: "Booking not sent", details: err.message },
      { status: 500 }
    );
  }
}
