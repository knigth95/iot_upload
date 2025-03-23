import React from 'react'
import { Button, Form, Input, message } from 'antd' // 合并 antd 导入
import { useNavigate } from 'react-router-dom'
import { Register } from '@/api'
import './style.less'

// 修复函数括号空格问题
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
















































    <div className="register">
      <div className="register-content">
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true }]}>
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item name="email" rules={[{ type: 'email' }]}>
            <Input placeholder="邮箱" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
        </Form>
      </div>

    </div>
  )
}
