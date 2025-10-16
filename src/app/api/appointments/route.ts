import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) return new Response(JSON.stringify([]));

  const appointments = await prisma.appointment.findMany({
    where: { date },
    select: { time: true },
  });

  // Return only booked times
  return new Response(JSON.stringify(appointments.map(a => a.time)));
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // ✅ Try to create the appointment
    let appointment;
    try {
      appointment = await prisma.appointment.create({ data });
    } catch (err: any) {
      if (err.code === 'P2002') {
        // Unique constraint failed
        return new Response(
          JSON.stringify({ error: "This time slot is already booked" }),
          { status: 400 }
        );
      }
      throw err; // re-throw other errors
    }

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
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
      from: `"Car Wash Booking" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: data.email,
      subject: "New Booking Form Submission",
      html: htmlMessage,
    });

    return new Response(JSON.stringify({ message: "Booking sent successfully", appointment }), { status: 200 });

  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Booking not sent" }), { status: 500 });
  }
}

