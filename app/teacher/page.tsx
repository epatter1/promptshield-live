import TeacherDashboardClient from "./TeacherDashboardClient";

export default async function TeacherDashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
      <TeacherDashboardClient />
    </div>
  );
}