"use client";

import { useState } from "react";

type Tab = {
  id: string;
  label: string;
};

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
};

export default function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap border-b border-gray-700 mb-4 gap-2 sm:gap-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            px-4 py-2 text-sm font-medium border-b-2
            whitespace-nowrap
            ${
              active === tab.id
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}