import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail
        pass: process.env.GMAIL_APP_PASSWORD, // App password
      },
    });

    const htmlMessage = `
      <h3>New Contact Form Submission</h3>
      <p><strong>First Name:</strong> ${data.firstname}</p>
      <p><strong>Middle Name:</strong> ${data.middlename}</p>
      <p><strong>Last Name:</strong> ${data.lastname}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Company 1:</strong> ${data.companyone}</p>
      <p><strong>Company 2:</strong> ${data.companytwo}</p>
      <p><strong>Company 3:</strong> ${data.companythree}</p>
      <p><strong>Company 4:</strong> ${data.companyfour}</p>
    `;

    await transporter.sendMail({
      from: `"${data.firstname}" <${data.email}>`,
      to: process.env.GMAIL_USER,
      subject: "Form Submission - About Page",
      html: htmlMessage,
    });

    return new Response(JSON.stringify({ message: "Email sent successfully" }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Email not sent" }), { status: 500 });
  }
}
