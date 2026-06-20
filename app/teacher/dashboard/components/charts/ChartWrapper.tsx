"use client";

import { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";

export default function ChartWrapper({
  title,
  description,
  options,
}: {
  title: string;
  description: string;
  options: any;
}) {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver(() => {
      try {
        ref.current.getEchartsInstance().resize();
      } catch { }
    });

    resizeObserver.observe(ref.current.getEchartsInstance().getDom());

    return () => resizeObserver.disconnect();
  }, []);

  const mergedOptions = {
    backgroundColor: "transparent",
    ...options,
  };

  return (
    <div className="rounded-lg bg-gray-900 border border-gray-800 p-4">
      <div className="text-center mb-3">
        <h2 className="text-base font-semibold text-gray-200">{title}</h2>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </div>

      <ReactECharts
        ref={ref}
        option={mergedOptions}
        style={{ height: "280px", width: "100%" }}   // increased height
        className="md:!h-[320px]"                    // increased desktop height
        notMerge={true}
        lazyUpdate={true}
        opts={{ renderer: "canvas" }}
      />

    </div>
  );
}
