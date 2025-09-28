"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  MapPin, 
  Calendar, 
  Thermometer, 
  Droplets, 
  Wind,
  Activity,
  TrendingUp,
  Globe
} from 'lucide-react';

interface QuerySuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function QuerySuggestions({ onSuggestionClick }: QuerySuggestionsProps) {
  const suggestions = [
    {
      category: "Location-based",
      icon: <MapPin className="w-4 h-4" />,
      queries: [
        "Show me salinity profiles near the equator in March 2023",
        "Find temperature data in the Arabian Sea for the last 6 months",
        "Display BGC parameters in the Pacific Ocean basin",
        "What floats are active in the Indian Ocean right now?"
      ]
    },
    {
      category: "Temporal Analysis",
      icon: <Calendar className="w-4 h-4" />,
      queries: [
        "Compare temperature trends over the last 2 years",
        "Show seasonal variations in salinity for 2023",
        "Find unusual readings in the past month",
        "Track float trajectories over time"
      ]
    },
    {
      category: "Parameter Analysis",
      icon: <Thermometer className="w-4 h-4" />,
      queries: [
        "Compare temperature and salinity correlations",
        "Show oxygen levels at different depths",
        "Find chlorophyll anomalies",
        "Display pressure profiles for deep water masses"
      ]
    },
    {
      category: "Anomaly Detection",
      icon: <Activity className="w-4 h-4" />,
      queries: [
        "Find unusual salinity spikes",
        "Detect temperature anomalies",
        "Show missing or quality-flagged data",
        "Identify outliers in BGC parameters"
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-white flex items-center gap-2">
        <Globe className="w-4 h-4 text-blue-400" />
        Try these ocean data queries:
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((category, idx) => (
          <Card key={idx} className="p-4 surface-glow bg-slate-800 border-slate-700">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-white">
              <span className="text-blue-400">{category.icon}</span>
              {category.category}
            </div>
            
            <div className="space-y-2">
              {category.queries.map((query, queryIdx) => (
                <Button
                  key={queryIdx}
                  variant="ghost"
                  size="sm"
                  onClick={() => onSuggestionClick(query)}
                  className="w-full text-left justify-start h-auto p-2 text-xs hover:bg-blue-50 hover:text-blue-700"
                  className="w-full text-left justify-start h-auto p-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-blue-300"
                >
                  {query}
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}