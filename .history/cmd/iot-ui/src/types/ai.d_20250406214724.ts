export interface AIRequestParams {
  provider?: 'siliconflow' | 'openrouter';
  model?: string;
  prompt: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  logFeatures?: string;
}

export interface APIResponse {
  code: number;
  message: string;
  data: {
    id?: number;
    question?: string;
    answer?: string;
    content?: string;
    model?: string;
    user_id?: string;
    created?: string;
    updated_at?: string;
  };
}

export interface AIRecommendation {
  id: number;
  title: string;
  content: string;
  // risk_level: 'high' | 'medium' | 'low';
  
  timestamp: string;
}
