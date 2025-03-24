import React from 'react'
import { Button, Form, Input, message } from 'antd' // 合并 antd 导入
import { useNavigate } from 'react-router-dom'
import { Register } from '@/api'
import './style.less'

export default function RegisterPage () {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = (values: any) => {
    Register(values).then(resp => {
      if (resp.success) {
        message.success('注册成功')
        navigate('/auth/login')
      }
    })
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* 左侧品牌区 - 与登录页保持一致 */}
      <div className="w-1/2 bg-[#2D3748] p-12 flex flex-col items-center">
        <div className="login-content__leftTitle" style={{ marginTop: '40px' }}>
          iot平台
        </div>
        <img
          className="w-full max-w-md object-contain mt-20"
          src={require('@/assets/images/background.png')}
          alt=""
        />
      </div>

      {/* 右侧注册表单 - 保持原有逻辑仅修改样式 */}
      <div className="w-1/2 p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="text-2xl font-medium mb-8">用户注册</div>
          <Form form={form} onFinish={onFinish} className="space-y-6">
            {/* 保留原有表单项，仅修改输入框样式 */}
            <Form.Item name="username" rules={[{ required: true }]}>
              <Input 
                placeholder="用户名"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true }]}>
              <Input.Password 
                placeholder="密码"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
              />
            </Form.Item>

            <Form.Item name="email" rules={[{ type: 'email' }]}>
              <Input 
                placeholder="邮箱"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
              />
            </Form.Item>

            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/auth/login')}
                className="flex-1 bg-gray-100 text-[#232F3E] px-6 py-3 rounded-full hover:bg-gray-200"
              >
                返回登录
              </Button>
              <Button
                htmlType="submit"
                className="flex-1 bg-[#232F3E] text-white px-6 py-3 rounded-full hover:bg-[#1A202C]"
              >
                确认注册
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
