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
  id: string;
  object: string;
  created: number;
  choices: {
    message: {
      role: string;
      content: string;
    };
    index: number;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIRecommendation {
  id: number;
  title: string;
  content: string;
  risk_level: 'high' | 'medium' | 'low';
  timestamp: string;
}
