import { httpRequest } from '@/utils/request'
import type { AIRequestParams, APIResponse } from '@/types/ai'

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
  return aiRequest(params.provider || 'siliconflow', params)
}

// 设备日志分析建议
export const analyzeDeviceLogs = async (logParams: {
  deviceId: string
  startTime: string
  endTime: string
}) => {
  const analysisPrompt = `分析以下时间段设备日志，识别潜在风险和提供改进建议：
  设备ID: ${logParams.deviceId}
  时间范围: ${logParams.startTime} 至 ${logParams.endTime}
  日志特征: ${logParams.logFeatures || '未指定日志特征'}`

  return aiRequest('siliconflow', {
    model: 'Qwen/QwQ-32B',
    prompt: analysisPrompt,
    max_tokens: 1024,
    temperature: 0.5,
  })
}
