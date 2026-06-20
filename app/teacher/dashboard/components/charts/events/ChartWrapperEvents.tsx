"use client";

export default function ChartWrapperEvents({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-gray-900 p-4">
      <div className="text-sm font-semibold text-gray-200 mb-3">
        {title}
      </div>

      <div className="w-full h-[340px]">
        {children}
      </div>
    </div>
  );
}