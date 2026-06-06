"use client";

import { useEffect, useState } from "react";
import SessionSummary from "./SessionSummary";
import EventList from "./EventList";

interface EventRecord {
  id: string;
  timestamp: string;
  sessionId: string;
  input: string;
  safeResponse: string;
  rawResponse?: string;
  classification: string;
  riskLevel: string;
  injectionDetected: number | boolean;
  rewriteApplied: number | boolean;
  modelName?: string;
  latencyMs?: number;
}

export default function SessionClient({ id }: { id: string }) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/events?sessionId=${id}`);
      const data = await res.json();
      setEvents(data.events || []);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="text-gray-600">Loading session…</div>;
  }

  return (
    <>
      <SessionSummary events={events} />
      <EventList events={events} />
    </>
  );
}