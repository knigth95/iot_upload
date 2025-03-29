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

  // 在返回语句中添加与登录页一致的布局结构
  return (
    <div className="login">
      <div className="register-content">
        <div className="register-content__left">
          <div className="login-content__leftTitle" style={{ marginTop: '40px' }}>
            IoT platform
          </div>
        </div>
        <div className="register-content__right">
          <div className="login-content__rightTitle">用户注册</div>
          <Form form={form} onFinish={onFinish}
            style={{
              margin: '80px 80px',
            }}
            className="login-form"
          >
            <Form.Item name="username" rules={[{ required: true }]}>
              <Input placeholder="用户名" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true }]}>
              <Input.Password placeholder="密码" />
            </Form.Item>
            <Form.Item name="email" rules={[{ type: 'email' }]}>
              <Input placeholder="邮箱" />
            </Form.Item>
            <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
            }}
            >
              <Button
                style={{
                  backgroundColor: '#232F3E',
                  borderRadius: '40px',
                  color: '#fefeff',
                  width: '40%',
                  height: '50px',
                  marginTop: '40px',
                }}
                type="primary" htmlType="submit">
                注册
              </Button>
              <Button
                style={{
                  backgroundColor: '#f0f2f5',
                  borderRadius: '40px',
                  color: '#232F3E',
                  width: '40%',
                  height: '50px',
                  marginTop: '40px',
                  border: '1px solid #232F3E',
                }}
                onClick={() => navigate('/auth/login')}>
                返回登录
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
