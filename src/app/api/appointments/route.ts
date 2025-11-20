import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("📥 Incoming booking data:", data);

    const appointmentData = {
      service: data.service,
      date: data.date,
      time: data.time,
      carType: data.carType,
      name: data.name,
      email: data.email,
      status: data.status || "Pending",
    };

    let appointment;

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
        to: `${process.env.GMAIL_USER}, ${appointmentData.email}`,
        replyTo: appointmentData.email,
        subject: "New Booking Form Submission",
        html: `
          <h3>New Booking</h3>
          <p>Service: ${appointmentData.service}</p>
          <p>Date: ${appointmentData.date}</p>
          <p>Time: ${appointmentData.time}</p>
          <p>Car: ${appointmentData.carType}</p>
          <p>Name: ${appointmentData.name}</p>
          <p>Email: ${appointmentData.email}</p>
          <p>Status: ${appointmentData.status}</p>
        `,
      });
    } catch (emailErr) {
      console.error("📧 Email error:", emailErr);
      // don't block booking
    }

    return NextResponse.json(
      { message: "Booking sent successfully", appointment },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ API Error:", err);
    return NextResponse.json(
      { error: "Booking not sent", details: err.message },
      { status: 500 }
    );
  }
}
