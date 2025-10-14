import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // ✅ Prevent duplicate bookings for same email/date/time
    const existing = await prisma.appointment.findFirst({
      where: {
        email: data.email,
        date: data.date,
        time: data.time,
      },
    });

    if (existing) {
      return new Response(
        JSON.stringify({ message: "Booking already exists" }),
        { status: 200 }
      );
    }

    // Save booking in MySQL
    const appointment = await prisma.appointment.create({
      data,
    });

    // Create Gmail transporter
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
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.time}</p>
      <p><strong>Car Type:</strong> ${data.carType}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Status:</strong> ${data.status}</p>
    `;

    await transporter.sendMail({
      from: `"${data.name}" <${data.email}>`,
      to: process.env.GMAIL_USER,
      subject: "New Booking Form Submission",
      html: htmlMessage,
    });

    return new Response(
      JSON.stringify({ message: "Booking sent successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Booking not sent" }), {
      status: 500,
    });
  }
}
