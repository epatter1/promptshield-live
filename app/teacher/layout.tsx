"use client";

import { ReactNode } from "react";

export default function TeacherLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {children}
    </div>
  );
}