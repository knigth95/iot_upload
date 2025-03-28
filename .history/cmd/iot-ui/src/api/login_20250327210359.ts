import { httpRequest } from '@/utils/request'
import { CommonResponse } from '@/types'

export interface User {
  username: string
  password: string
}
export function Login<T> (data: User) {
  return httpRequest<any, CommonResponse<T>>({
    url: '/api/v1/auth/login',
    method: 'post',
    data,
  })
}

export function changePassword <T> (data: any) {
  return httpRequest<any, CommonResponse<T>>({
    url: '/api/v1/auth/password ',
    method: 'put',
    data,
  })
}

export function getInitInfo<T> () {
  return httpRequest<any, CommonResponse<T>>({
    url: '/api/v1/auth/initInfo',
    method: 'get',
  })
}

export function initPassword<T> (data: any) {
  return httpRequest<any, CommonResponse<T>>({
    url: '/api/v1/auth/init-password',
    method: 'post',
    data,
  })
}

export const Register = (data: {
  username: string;
  password: string;
  email: string;
  captcha: string;
  captchaKey: string;
}) => {
  return httpRequest<any, CommonResponse<any>>({
    url: '/api/v1/auth/register',
    method: 'post',
    data,
  })
}

export const GetCaptcha = (email: string) => {
  return httpRequest<any, CommonResponse<{key: string}>>({
    url: '/api/v1/auth/captcha',
    method: 'post',
    data: { email },
  })
}
