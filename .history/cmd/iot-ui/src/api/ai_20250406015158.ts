import { httpRequest } from '@/utils/request'
import type { AIRequestParams, APIResponse, AIRecommendation } from '@/types/ai'

const API_ENDPOINTS = {
  siliconflow: 'https://api.siliconflow.cn/v1/chat/completions',
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
}

// 统一AI请求方法
const aiRequest = async (endpoint: keyof typeof API_ENDPOINTS, params: AIRequestParams) => {
  return httpRequest<APIResponse>({
    url: API_ENDPOINTS[endpoint],
    method: 'post',
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_AI_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'IoT Management System',
    },
    data: {
      model: params.model || 'deepseek-ai/DeepSeek-V3',
      messages: [{ role: 'user', content: params.prompt }],
      temperature: params.temperature ?? 0.7,
      max_tokens: params.max_tokens ?? 512,
      top_p: params.top_p ?? 0.7,
      frequency_penalty: params.frequency_penalty ?? 0.5,
    },
  })
}

// AI问答（支持多模型）
export const getAIResponse = async (params: AIRequestParams) => {
  // 如果是直接调用外部AI API
  if (params.provider && API_ENDPOINTS[params.provider]) {
    return aiRequest(params.provider, params)
  }

  // 否则调用后端API
  return httpRequest<APIResponse>({
    url: '/api/v1/ai/qa',
    method: 'post',
    data: params,
  })
}

// 设备日志分析建议
export const analyzeDeviceLogs = async (logParams: {
  logFeatures: string
  deviceId: string
  startTime: string
  endTime: string
}) => {
  const analysisPrompt = `分析以下时间段设备日志，识别潜在风险和提供改进建议：
  设备ID: ${logParams.deviceId}
  时间范围: ${logParams.startTime} 至 ${logParams.endTime}
  日志特征: ${logParams.logFeatures || '未指定日志特征'}`

  return httpRequest<APIResponse>({
    url: '/api/v1/ai/recommendations/generate',
    method: 'post',
    data: {
      deviceId: logParams.deviceId,
      propertyId: 'logs',
      prompt: analysisPrompt,
    },
  })
}

// 获取AI建议列表
export const getAIRecommendations = async () => {
  return httpRequest<{ data: AIRecommendation[] }>({
    url: '/api/v1/ai/recommendations',
    method: 'get',
  })
}

// 获取最新AI建议
export const getLatestAIRecommendation = async () => {
  return httpRequest<{ data: AIRecommendation }>({
    url: '/api/v1/ai/recommendations/latest',
    method: 'get',
  })
}

// 生成新的AI建议（通常由系统自动调用，也可手动触发）
export const generateAIRecommendation = async (params: {
  deviceId?: string
  propertyId?: string
  timeRange?: { start: string; end: string }
}) => {
  return httpRequest<{ data: AIRecommendation }>({
    url: '/api/v1/ai/recommendations/generate',
    method: 'post',
    data: params,
  })
}
