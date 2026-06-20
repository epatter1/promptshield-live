import { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <section className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
      <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
      {children}
    </section>
  );
}