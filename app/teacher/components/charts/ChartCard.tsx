"use client";

export default function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="h-64 md:h-80 w-full">{children}</div>
    </div>
  );
}
