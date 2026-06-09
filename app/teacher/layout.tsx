import { ReactNode } from "react";

export default function TeacherLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="p-8">{children}</div>;
}