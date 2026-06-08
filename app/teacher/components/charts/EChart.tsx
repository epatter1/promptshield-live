"use client";

import ReactECharts from "echarts-for-react";

interface EChartProps {
  option: any;
  onEvents?: Record<string, (params: any) => void>;
  style?: React.CSSProperties;
}

export default function EChart({ option, onEvents, style }: EChartProps) {
  return (
    <ReactECharts
      option={option}
      onEvents={onEvents}
      style={{
        height: "320px",   // ⭐ FIXED HEIGHT
        width: "100%",
        ...style,          // allow overrides
      }}
    />
  );
}