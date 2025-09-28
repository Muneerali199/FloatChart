import axios from 'axios';
import { ChatMessage, QueryMetadata, VisualizationSpec, DataExportRequest, SystemHealth } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const chatAPI = {
  sendMessage: async (message: string, sessionId: string, context?: any): Promise<ChatMessage> => {
    const response = await api.post('/chat/message', {
      message,
      session_id: sessionId,
      context,
    });
    return response.data;
  },

  getSessionHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await api.get(`/chat/sessions/${sessionId}/messages`);
    return response.data;
  },

  createSession: async (): Promise<{ session_id: string }> => {
    const response = await api.post('/chat/sessions');
    return response.data;
  },

  updateContext: async (sessionId: string, context: any): Promise<void> => {
    await api.patch(`/chat/sessions/${sessionId}/context`, context);
  },
};

export const dataAPI = {
  searchFloats: async (query: string, filters?: any): Promise<any[]> => {
    const response = await api.post('/data/search/floats', {
      query,
      filters,
    });
    return response.data;
  },

  getProfileData: async (floatId: string, cycleNumber?: number): Promise<any> => {
    const response = await api.get(`/data/floats/${floatId}/profiles`, {
      params: { cycle_number: cycleNumber },
    });
    return response.data;
  },

  queryData: async (sqlQuery: string): Promise<any[]> => {
    const response = await api.post('/data/query', {
      query: sqlQuery,
    });
    return response.data;
  },

  getRegionSummary: async (bounds: any, timeRange?: any): Promise<any> => {
    const response = await api.post('/data/regions/summary', {
      bounds,
      time_range: timeRange,
    });
    return response.data;
  },

  exportData: async (request: DataExportRequest): Promise<{ download_url: string }> => {
    const response = await api.post('/data/export', request);
    return response.data;
  },
};

export const visualizationAPI = {
  generateVisualization: async (query: string, data: any[]): Promise<VisualizationSpec> => {
    const response = await api.post('/visualizations/generate', {
      query,
      data,
    });
    return response.data;
  },

  getPlotlyConfig: async (vizType: string, data: any[]): Promise<any> => {
    const response = await api.post('/visualizations/plotly-config', {
      viz_type: vizType,
      data,
    });
    return response.data;
  },

  saveVisualization: async (vizSpec: VisualizationSpec, name: string): Promise<{ id: string }> => {
    const response = await api.post('/visualizations/save', {
      specification: vizSpec,
      name,
    });
    return response.data;
  },
};

export const systemAPI = {
  getHealth: async (): Promise<SystemHealth> => {
    const response = await api.get('/system/health');
    return response.data;
  },

  getMetrics: async (): Promise<any> => {
    const response = await api.get('/system/metrics');
    return response.data;
  },

  triggerDataIngestion: async (files: string[]): Promise<{ job_id: string }> => {
    const response = await api.post('/system/ingestion', {
      files,
    });
    return response.data;
  },
};

export const embedAPI = {
  searchSimilar: async (query: string, limit: number = 10): Promise<any[]> => {
    const response = await api.post('/embeddings/search', {
      query,
      limit,
    });
    return response.data;
  },

  updateEmbeddings: async (documents: any[]): Promise<void> => {
    await api.post('/embeddings/update', {
      documents,
    });
  },
};

export default api;