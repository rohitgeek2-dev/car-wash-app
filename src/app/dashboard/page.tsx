import { redirect } from 'next/navigation';

export default function DashboardRouter() {
  const role = 'admin'; // change to 'user' to test user view

  if (role === 'admin') {
    redirect('/dashboard/admin');
  } else {
    redirect('/dashboard/user');
  }
}
