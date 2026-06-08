import { ReactNode } from "react";

export default function SessionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-8 space-y-8">
      {children}
    </div>
  );
}