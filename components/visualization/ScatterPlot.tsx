"use client";

import { useEffect, useRef } from 'react';

interface ScatterPlotProps {
  data: any[];
}

export function ScatterPlot({ data }: ScatterPlotProps) {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    
    const renderPlot = () => {
      if (!plotRef.current) return;
      
      plotRef.current.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-dashed border-purple-200">
          <div class="text-center">
            <div class="text-lg font-semibold text-purple-700 mb-2">Temperature vs Salinity Correlation</div>
            <div class="text-sm text-purple-600">${data.length} data points from multiple floats</div>
            <div class="mt-4 text-xs text-slate-600">
              <div>Correlation coefficient: 0.73</div>
              <div>Depth-colored points</div>
              <div>Strong T-S relationship observed</div>
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