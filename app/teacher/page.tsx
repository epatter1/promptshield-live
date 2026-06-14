import DashboardClient from "../teacher/dashboard/DashboardClient";
import { getEvents } from "./lib/db/events";

export default async function TeacherPage() {
  const events = await getEvents(); // MUST return EventRow[]

  return <DashboardClient events={events} />;
}
