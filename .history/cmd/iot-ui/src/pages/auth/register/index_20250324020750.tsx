import { Register } from '@/api'
import { NUseRequest as useRequest } from '@/hooks/useRequest' // 修改为正确的导出名称
import { message } from 'antd'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input } from 'antd'
import './style.less'

export default function RegisterPage() {
  const navigate = useNavigate()

  const onRegisterFinish = useCallback((values: any) => {
    Register(values).then(resp => {
      if (resp.success) {
        message.success('注册成功')
        navigate('/login') // 直接跳转登录页
      } else {
        message.error(resp.errorMsg)
      }
    })
  }, [navigate])

  return (
    <div className="login">
      <div className="login-content">
        <div className="login-content__right">
          <div className="login-content__rightTitle">用户注册</div>
          <Form
            name="register"
            onFinish={onRegisterFinish}
            autoComplete="off"
            className="login-form"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}>
              <Input placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password placeholder="密码" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '邮箱格式不正确' },
              ]}
            >
              <Input placeholder="邮箱" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: '#232F3E',
                  borderRadius: '40px',
                  color: '#fefeff',
                  width: '80%',
                  height: '50px',
                  marginTop: '60px',
                  marginLeft: '50px',
                }}
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="login-copyright">Copyright © 2024-2025 knight</div>
    </div>
  )
}
