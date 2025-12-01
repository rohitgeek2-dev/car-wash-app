// src/app/user/dashboard/page.tsx

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken, TOKEN_NAME } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value || null;

  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <p>Not authenticated. <Link href="/login">Login</Link></p>
      </div>
    );
  }

  const payload = verifyToken(token);

  if (!payload || !payload.userId) {
    return (
      <div style={{ padding: 20 }}>
        <p>Session invalid. <Link href="/login">Login</Link></p>
      </div>
    );
  }

  const userId = payload.userId;

  const appointments = await prisma.appointment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Bookings</h1>

      <div style={{ margin: "12px 0" }}>
        <LogoutButton />
      </div>

      {appointments.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Service</th>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Date</th>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Time</th>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td style={{ padding: 8 }}>{a.service}</td>
                <td style={{ padding: 8 }}>{a.date}</td>
                <td style={{ padding: 8 }}>{a.time}</td>
                <td style={{ padding: 8 }}>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
