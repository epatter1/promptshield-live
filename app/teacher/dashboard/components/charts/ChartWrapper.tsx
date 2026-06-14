"use client";

import { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";

export default function ChartWrapper({ option }: { option: any }) {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver(() => {
      try {
        ref.current.getEchartsInstance().resize();
      } catch {}
    });

    resizeObserver.observe(ref.current.getEchartsInstance().getDom());

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <ReactECharts
      ref={ref}
      option={option}
      style={{ height: "220px", width: "100%" }}
      className="md:!h-[260px]"
      notMerge={true}
      lazyUpdate={true}
      opts={{ renderer: "canvas" }}
    />
  );
}