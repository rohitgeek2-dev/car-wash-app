import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    // Use string comparison if date is stored as string in DB
    const bookings = await prisma.appointment.findMany({
      where: { date }, // keep as string
      select: { time: true },
    }); 

    // Format booked times
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
