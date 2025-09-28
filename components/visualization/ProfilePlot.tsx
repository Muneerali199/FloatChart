"use client";

import { useEffect, useRef } from 'react';

interface ProfilePlotProps {
  data: any[];
}

export function ProfilePlot({ data }: ProfilePlotProps) {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    
    // Mock Plotly.js implementation
    // In production, use actual Plotly.js library
    const renderPlot = () => {
      if (!plotRef.current) return;
      
      plotRef.current.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-dashed border-blue-200">
          <div class="text-center">
            <div class="text-lg font-semibold text-blue-700 mb-2">Temperature & Salinity Profiles</div>
            <div class="text-sm text-blue-600">${data.length} measurements from ARGO floats</div>
            <div class="mt-4 text-xs text-slate-600">
              <div>Depth range: 0-2000m</div>
              <div>Temperature: 15-28°C</div>
              <div>Salinity: 34-36 PSU</div>
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