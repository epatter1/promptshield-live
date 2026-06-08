"use client";

import { FilterProvider } from "./context/FilterContext";
import { ReactNode } from "react";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <FilterProvider>
      <div className="space-y-8 p-8">
        {children}
      </div>
    </FilterProvider>
  );
}