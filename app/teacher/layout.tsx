"use client";

import { ReactNode } from "react";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Modal Portal Root */}
      <div id="modal-root" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}