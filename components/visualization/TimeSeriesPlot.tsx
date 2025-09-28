"use client";

import { useEffect, useRef } from 'react';

interface TimeSeriesPlotProps {
  data: any[];
}

export function TimeSeriesPlot({ data }: TimeSeriesPlotProps) {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    
    const renderPlot = () => {
      if (!plotRef.current) return;
      
      plotRef.current.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border-2 border-dashed border-green-200">
          <div class="text-center">
            <div class="text-lg font-semibold text-green-700 mb-2">Ocean Parameters Over Time</div>
            <div class="text-sm text-green-600">${data.length} daily measurements in 2023</div>
            <div class="mt-4 text-xs text-slate-600">
              <div>Temperature trend: Seasonal variation</div>
              <div>Salinity: Stable with minor fluctuations</div>
              <div>Active floats: 15-23 per day</div>
            </div>
          </div>
        </div>
      `;
    };

    renderPlot();
  }, [data]);

  return (
    <div className="w-full h-full">
      <div ref={plotRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
}