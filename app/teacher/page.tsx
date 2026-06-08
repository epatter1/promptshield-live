import TeacherDashboardClient from "./TeacherDashboardClient";

export default async function TeacherDashboardPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/events`, {
    cache: "no-store",
  });

  const data = await res.json();
  const events = data.events ?? [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
      <TeacherDashboardClient events={events} />
    </div>
  );
}