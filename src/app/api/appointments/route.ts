import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 🔍 Log raw incoming data
    console.log("📥 RAW Incoming booking data:", data);

    // -----------------------------------------
    // ✅ SANITIZE & NORMALIZE DATE + TIME
    // -----------------------------------------
    const rawDate = data.date ? data.date.toString().trim() : "";
    const rawTime = data.time ? data.time.toString().trim() : "";

    if (!rawDate) {
      return NextResponse.json(
        { error: "Invalid date", details: "Date cannot be empty" },
        { status: 400 }
      );
    }

    // If date is ISO (2025-12-05T00:00:00Z)
    let finalDate = rawDate;
    if (rawDate.includes("T")) {
      finalDate = rawDate.split("T")[0]; // Convert ISO → YYYY-MM-DD
    }

    // Final clean payload
    const appointmentData = {
      service: data.service?.toString() || "",
      date: finalDate, // ALWAYS a clean string
      time: rawTime,
      carType: data.carType?.toString() || "",
      name: data.name?.toString() || "",
      email: data.email?.toString() || "",
      status: "Pending",
    };

    console.log("📦 Final processed appointment:", appointmentData);

    // -----------------------------------------
    // ✅ SAVE TO DATABASE
    // -----------------------------------------
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

// -----------------------------------------
// ✅ SEND EMAIL TO ADMIN ONLY (NOT USER)
// -----------------------------------------
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
        to: process.env.GMAIL_USER,
        replyTo: appointmentData.email,
        subject: "New Booking Request (Pending Approval)",
        html: `
          <h2>New Booking Request (Pending)</h2>
          <p><strong>Service:</strong> ${appointmentData.service}</p>
          <p><strong>Date:</strong> ${appointmentData.date}</p>
          <p><strong>Time:</strong> ${appointmentData.time}</p>
          <p><strong>Car Type:</strong> ${appointmentData.carType}</p>
          <p><strong>Name:</strong> ${appointmentData.name}</p>
          <p><strong>Email:</strong> ${appointmentData.email}</p>
        `,
      });
    } catch (emailErr) {
      console.error("📧 Email sending error:", emailErr);
    }

    // -----------------------------------------
    // ✅ SUCCESS RESPONSE
    // -----------------------------------------
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
