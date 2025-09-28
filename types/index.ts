// Core data types for FloatChat system
export interface ArgoFloat {
  id: string;
  platform_number: string;
  wmo_inst_type: string;
  project_name: string;
  pi_name: string;
  latitude: number;
  longitude: number;
  date: string;
  cycle_number: number;
  direction: 'A' | 'D'; // Ascending or Descending
  data_centre: string;
  ocean: string;
  profiler_type: string;
  institution: string;
  country: string;
}

export interface ProfileData {
  pressure: number[];
  temperature: number[];
  salinity: number[];
  oxygen?: number[];
  nitrate?: number[];
  ph?: number[];
  depth: number[];
  quality_flags: number[];
}

export interface ArgoProfile extends ArgoFloat {
  profile_data: ProfileData;
  quality_control: {
    position_qc: number;
    time_qc: number;
    profile_qc: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  query_metadata?: QueryMetadata;
  visualization_spec?: VisualizationSpec;
  confidence_score?: number;
  context_used?: string[];
}

export interface QueryMetadata {
  original_query: string;
  processed_query: string;
  sql_query: string;
  retrieved_documents: RetrievedDocument[];
  execution_time: number;
  data_points_returned: number;
  spatial_bounds?: GeoBounds;
  temporal_bounds?: TemporalBounds;
}

export interface RetrievedDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  similarity_score: number;
  source: string;
}

export interface VisualizationSpec {
  type: 'profile' | 'timeseries' | 'map' | 'histogram' | 'scatter' | 'heatmap';
  data: any[];
  config: {
    title: string;
    x_axis: string;
    y_axis: string;
    color_by?: string;
    size_by?: string;
    annotations?: Annotation[];
  };
  plotly_config?: any;
  leaflet_config?: any;
}

export interface Annotation {
  x: number;
  y: number;
  text: string;
  type: 'anomaly' | 'insight' | 'explanation';
}

export interface GeoBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface TemporalBounds {
  start: Date;
  end: Date;
}

export interface DataExportRequest {
  format: 'csv' | 'netcdf' | 'json' | 'parquet';
  query_id: string;
  filters?: Record<string, any>;
  spatial_bounds?: GeoBounds;
  temporal_bounds?: TemporalBounds;
}

export interface AIConfig {
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'llama2' | 'qwen' | 'mistral';
  temperature: number;
  max_tokens: number;
  context_window: number;
  embeddings_model: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  services: {
    database: boolean;
    vector_db: boolean;
    llm_service: boolean;
    data_processing: boolean;
  };
  metrics: {
    active_users: number;
    queries_per_hour: number;
    avg_response_time: number;
    data_freshness: Date;
  };
}

export interface UserSession {
  id: string;
  user_id?: string;
  conversation_history: ChatMessage[];
  context: QueryContext;
  preferences: UserPreferences;
  created_at: Date;
  last_active: Date;
}

export interface QueryContext {
  spatial_focus?: GeoBounds;
  temporal_focus?: TemporalBounds;
  preferred_parameters: string[];
  recent_floats: string[];
  active_filters: Record<string, any>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'ocean';
  units: 'metric' | 'imperial';
  visualization_defaults: {
    map_provider: 'openstreetmap' | 'satellite' | 'ocean';
    color_scheme: string;
    plot_style: 'scientific' | 'presentation';
  };
  expertise_level: 'beginner' | 'intermediate' | 'expert';
  educational_mode: boolean;
}

export interface OceanAnomalies {
  id: string;
  type: 'temperature' | 'salinity' | 'oxygen' | 'current';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    latitude: number;
    longitude: number;
    region: string;
  };
  detected_at: Date;
  description: string;
  affected_floats: string[];
  confidence: number;
  auto_generated: boolean;
}

export interface DataIngestionJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  source_files: string[];
  output_format: 'parquet' | 'postgresql' | 'both';
  progress: number;
  start_time: Date;
  end_time?: Date;
  error_message?: string;
  stats: {
    files_processed: number;
    profiles_extracted: number;
    data_quality_issues: number;
  };
}