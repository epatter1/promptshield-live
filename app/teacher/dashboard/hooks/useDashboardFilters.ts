"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { EventRow } from "../../types/EventRow";

const VALID_CATEGORIES = [
  "GENERAL",
  "SAFE",
  "PII",
  "CONFIDENTIAL",
  "FRAUD",
  "VIOLENCE",
  "SELF_HARM",
  "EXTREMISM",
  "HATE",
  "MALWARE",
  "JAILBREAK",
  "MANIPULATION",
];

export default function useDashboardFilters(events: EventRow[] = []) {
  const searchParams = useSearchParams();

  const categoryFilter = searchParams.get("category");
  const riskFilter = searchParams.get("risk");

  // Filter events based on URL params
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const categoryMatch = categoryFilter ? e.classification === categoryFilter : true;
      const riskMatch = riskFilter ? e.riskLevel === riskFilter : true;
      return categoryMatch && riskMatch;
    });
  }, [events, categoryFilter, riskFilter]);

  // Unique categories present in the dataset
  const uniqueCategories = useMemo(() => {
    return VALID_CATEGORIES.filter((cat) =>
      events.some((e) => e.classification === cat)
    );
  }, [events]);

  // Unique sessions after filtering
  const uniqueSessions = useMemo(() => {
    return Array.from(new Set(filteredEvents.map((e) => e.sessionId)));
  }, [filteredEvents]);

  return {
    filteredEvents,
    uniqueCategories,
    uniqueSessions,
    categoryFilter,
    riskFilter,
  };
}