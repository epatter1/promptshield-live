"use client";

import EChart from "./EChart";
import type { EChartsOption } from "echarts";

interface EventRecord {
  riskLevel: "low" | "medium" | "high" | string;
}

interface Props {
  events: EventRecord[];
}

export default function RiskDistributionChart({ events }: Props) {
  const counts = {
    low: 0,
    medium: 0,
    high: 0
  };

  events.forEach((e) => {
    if (e.riskLevel === "low") counts.low++;
    if (e.riskLevel === "medium") counts.medium++;
    if (e.riskLevel === "high") counts.high++;
  });

  const option: EChartsOption = {
    tooltip: {
      trigger: "item"
    },
    legend: {
      orient: "horizontal",
      bottom: 0
    },
    series: [
      {
        name: "Risk Levels",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        data: [
          { value: counts.low, name: "Low" },
          { value: counts.medium, name: "Medium" },
          { value: counts.high, name: "High" }
        ]
      }
    ]
  };

  return <EChart option={option} />;
}