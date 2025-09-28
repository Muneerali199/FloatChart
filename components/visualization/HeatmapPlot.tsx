"use client";

import { useEffect, useRef } from 'react';

interface HeatmapPlotProps {
  data: any[];
}

export function HeatmapPlot({ data }: HeatmapPlotProps) {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    
    const renderPlot = () => {
      if (!plotRef.current) return;
      
      plotRef.current.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-2 border-dashed border-orange-200">
          <div class="text-center">
            <div class="text-lg font-semibold text-orange-700 mb-2">Sea Surface Temperature Heatmap</div>
            <div class="text-sm text-orange-600">${data.length} grid points in the Arabian Sea</div>
            <div class="mt-4 text-xs text-slate-600">
              <div>Latitude: -10° to 10°</div>
              <div>Longitude: 60° to 80°</div>
              <div>Temperature range: 24-30°C</div>
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