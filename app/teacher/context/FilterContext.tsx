"use client";

import { createContext, useContext, useState } from "react";

type FilterState = {
  riskLevels: string[];
  injectionOnly: boolean;
  rewriteOnly: boolean;
  modelNames: string[];
  dateRange: string;
  sessionId: string | null;
};

type FilterContextType = {
  filters: FilterState;
  setRiskLevels: (levels: string[]) => void;
  setInjectionOnly: (value: boolean) => void;
  setRewriteOnly: (value: boolean) => void;
  setModelNames: (models: string[]) => void;
  setDateRange: (range: string) => void;
  setSessionId: (id: string | null) => void;
};

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>({
    riskLevels: [],
    injectionOnly: false,
    rewriteOnly: false,
    modelNames: [],
    dateRange: "all",
    sessionId: null,
  });

  return (
    <FilterContext.Provider
      value={{
        filters,
        setRiskLevels: (riskLevels) =>
          setFilters((f) => ({ ...f, riskLevels })),
        setInjectionOnly: (injectionOnly) =>
          setFilters((f) => ({ ...f, injectionOnly })),
        setRewriteOnly: (rewriteOnly) =>
          setFilters((f) => ({ ...f, rewriteOnly })),
        setModelNames: (modelNames) =>
          setFilters((f) => ({ ...f, modelNames })),
        setDateRange: (dateRange) =>
          setFilters((f) => ({ ...f, dateRange })),
        setSessionId: (sessionId) =>
          setFilters((f) => ({ ...f, sessionId })),
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used inside FilterProvider");
  return ctx;
}