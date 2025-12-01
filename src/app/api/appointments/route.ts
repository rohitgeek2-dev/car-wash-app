import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // SANITIZE DATE & TIME
    const rawDate = data.date ? data.date.toString().trim() : "";
    const rawTime = data.time ? data.time.toString().trim() : "";

    if (!rawDate) {
      return NextResponse.json(
        { error: "Invalid date", details: "Date cannot be empty" },
        { status: 400 }
      );
    }

    let finalDate = rawDate.includes("T") ? rawDate.split("T")[0] : rawDate;

    const appointmentData = {
      service: data.service?.toString() || "",
      date: finalDate,
      time: rawTime,
      carType: data.carType?.toString() || "",
      name: data.name?.toString() || "",
      email: data.email?.toString() || "",
      status: "Pending",
    };

    // -----------------------------------------
    // ✅ USER CHECK + AUTO-CREATE
    // -----------------------------------------
    let user = await prisma.user.findUnique({
      where: { email: appointmentData.email },
    });

    let plainPassword = "";

    if (!user) {
      // Generate password
      plainPassword = crypto.randomBytes(4).toString("hex"); // 8-char password
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Create user
      user = await prisma.user.create({
        data: {
          name: appointmentData.name,
          email: appointmentData.email,
          password: hashedPassword,
        },
      });
    }

    // -----------------------------------------
    // ✅ SAVE APPOINTMENT LINKED TO USER
    // -----------------------------------------
    const appointment = await prisma.appointment.create({
      data: {
        ...appointmentData,
        userId: user.id,
      }
    });

    // -----------------------------------------
    // EMAIL TRANSPORTER
    // -----------------------------------------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // -----------------------------------------
    // ✅ SEND EMAIL TO ADMIN + USER (existing)
    // -----------------------------------------
    await transporter.sendMail({
      from: `"Car Wash Booking" <${process.env.GMAIL_USER}>`,
      to: `${process.env.GMAIL_USER}, ${appointmentData.email}`,
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

    // -----------------------------------------
    // 📧 SEND USER LOGIN DETAILS (only for NEW users)
    // -----------------------------------------
    if (plainPassword) {
      await transporter.sendMail({
        from: `"Car Wash Portal" <${process.env.GMAIL_USER}>`,
        to: appointmentData.email,
        subject: "Your Car Wash Account Login Details",
        html: `
          <h2>Welcome to Car Wash Portal!</h2>
          <p>Your booking has been received successfully.</p>
          <br/>
          <h3>Your Login Details:</h3>
          <p><strong>Email:</strong> ${appointmentData.email}</p>
          <p><strong>Password:</strong> ${plainPassword}</p>
          <br/>
          <a href="https://yourwebsite.com/login" 
             style="padding:12px 20px; background:#007bff; color:white; text-decoration:none; border-radius:5px;">
             Login to your Dashboard
          </a>
        `,
      });
    }

    // -----------------------------------------
    // SUCCESS RESPONSE
    // -----------------------------------------
    return NextResponse.json(
      {
        message: "Booking created, email sent, user processed.",
        appointment,
      },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("❌ GLOBAL API Error:", err);
    return NextResponse.json(
      { error: "Booking failed", details: err.message },
      { status: 500 }
    );
  }
}
