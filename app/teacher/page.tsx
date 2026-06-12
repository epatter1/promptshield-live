"use client";

export const dynamic = "force-dynamic";

import DashboardClient from "./dashboard-client";

export default function TeacherPage() {
  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-8 text-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        Eagle AI Prompt Defender
      </h1>
      <DashboardClient />
    </div>
  );
}