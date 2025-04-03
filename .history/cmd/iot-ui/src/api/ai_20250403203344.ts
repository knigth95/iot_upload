import { request } from '@/utils/request'

// AI问答API
export const getAIResponse = async (question: string) => {
  return request({
    url: '/api/v1/ai/qa',
    method: 'post',
    data: { question }
  })
}

// AI建议API
export const getAIAdvice = async () => {
  return request({
    url: '/api/v1/ai/advice',
    method: 'get'
  })
}