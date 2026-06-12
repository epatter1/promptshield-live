"use client";

import DashboardClient from "./dashboard-client";

export default function TeacherPage() {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
      <DashboardClient />
    </div>
  );
}