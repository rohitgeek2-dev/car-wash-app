import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Convert date string to a JS Date object
    const appointmentData = {
      service: data.service,
      date: new Date(data.date + "T00:00:00"), // <--- convert string to Date at midnight
      time: data.time,
      carType: data.carType,
      name: data.name,
      email: data.email,
      status: data.status || "Pending",
    };

    // Create appointment
    let appointment;
    try {
      appointment = await prisma.appointment.create({
        data: appointmentData,
      });
    } catch (err: any) {
      if (err.code === "P2002") {
        return new Response(
          JSON.stringify({ error: "This time slot is already booked" }),
          { status: 400 }
        );
      }
      throw err;
    }

    // Send email
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
      <p><strong>Status:</strong> ${data.status || "Pending"}</p>
    `;

    await transporter.sendMail({
      from: `"Car Wash Booking" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: data.email,
      subject: "New Booking Form Submission",
      html: htmlMessage, 
    });

    return new Response(
      JSON.stringify({ message: "Booking sent successfully", appointment }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Booking error:", err);
    return new Response(JSON.stringify({ error: "Booking not sent" }), { status: 500 });
  }
}
