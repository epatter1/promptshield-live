"use client";

import { useState, useMemo, useCallback } from "react";
import { EventRow } from "../../types/EventRow";

export default function useSessionEvents(
  selectedEvent: EventRow | null,
  selectedSession: string | null
) {
  const [sessionEvents, setSessionEvents] = useState<EventRow[]>([]);
  const [modalSessionEvents, setModalSessionEvents] = useState<EventRow[]>([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState<number | null>(null);

  // Load events for a selected session
  const loadSessionEvents = useCallback((allEvents: EventRow[], sessionId: string) => {
    const events = allEvents.filter((e) => e.sessionId === sessionId);
    setSessionEvents(events);
  }, []);

  // Open modal for a specific event
  const openModal = useCallback(
    (event: EventRow) => {
      if (!sessionEvents.length) return;

      setModalSessionEvents(sessionEvents);

      const index = sessionEvents.findIndex((e) => e.id === event.id);
      setModalCurrentIndex(index >= 0 ? index : 0);
    },
    [sessionEvents]
  );

  const closeModal = useCallback(() => {
    setModalCurrentIndex(null);
    setModalSessionEvents([]);
  }, []);

  const navigateModal = useCallback(
    (dir: "prev" | "next") => {
      if (modalCurrentIndex === null || !modalSessionEvents.length) return;

      const nextIndex =
        dir === "prev"
          ? modalCurrentIndex - 1
          : modalCurrentIndex + 1;

      if (nextIndex >= 0 && nextIndex < modalSessionEvents.length) {
        setModalCurrentIndex(nextIndex);
      }
    },
    [modalCurrentIndex, modalSessionEvents]
  );

  return {
    sessionEvents,
    modalSessionEvents,
    modalCurrentIndex,
    openModal,
    closeModal,
    navigateModal,
    loadSessionEvents,
  };
}