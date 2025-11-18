import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Incoming booking data:", data);

    const appointmentData = {
      service: data.service,
      date: new Date(data.date).toISOString().split("T")[0], // YYYY-MM-DD
      time: data.time,
      carType: data.carType,
      name: data.name,
      email: data.email,
      status: data.status || "Pending",
    };

    // Create appointment
    let appointment;
    try {
      appointment = await prisma.appointment.create({ data: appointmentData });
    } catch (err: any) {
      console.error("Prisma create error:", err);
      if (err.code === "P2002") {
        return new Response(JSON.stringify({ error: "This time slot is already booked" }), { status: 400 });
      }
      return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
    }

    // Send email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const htmlMessage = `
        <h3>New Booking Submission</h3>
        <p><strong>Service:</strong> ${appointmentData.service}</p>
        <p><strong>Date:</strong> ${appointmentData.date}</p>
        <p><strong>Time:</strong> ${appointmentData.time}</p>
        <p><strong>Car Type:</strong> ${appointmentData.carType}</p>
        <p><strong>Name:</strong> ${appointmentData.name}</p>
        <p><strong>Email:</strong> ${appointmentData.email}</p>
        <p><strong>Status:</strong> ${appointmentData.status}</p>
      `;

      await transporter.sendMail({
        from: `"Car Wash Booking" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        replyTo: appointmentData.email,
        subject: "New Booking Form Submission",
        html: htmlMessage,
      });
    } catch (emailErr) {
      console.error("Email sending error:", emailErr);
    }

    return new Response(JSON.stringify({ message: "Booking sent successfully", appointment }), { status: 200 });

  } catch (err) {
    console.error("Booking API Error:", err);
    return new Response(
      JSON.stringify({ error: "Booking not sent", details: err instanceof Error ? err.message : String(err) }),
      { status: 500 }
    );
  }
}
