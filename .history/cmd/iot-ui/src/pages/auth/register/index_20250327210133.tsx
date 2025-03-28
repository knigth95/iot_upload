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
          <Form
            form={form}
            onFinish={onFinish}
            style={{
              margin: '80px 80px',
            }}
            className="login-form"
          >
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input placeholder="用户名" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
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

            <Form.Item
              name="captchaKey"
              hidden
            >
              <Input type="hidden" />
            </Form.Item>

            <Form.Item
              name="captcha"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <div style={{ display: 'flex', gap: '10px' }}>
                <Input placeholder="验证码" style={{ flex: 1 }} />
                <Button
                  onClick={async () => {
                    const email = form.getFieldValue('email')
                    if (!email) {
                      message.error('请先输入邮箱')
                      return
                    }
                    try {
                      const res = await fetch('/api/captcha', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email })
                      })
                      const data = await res.json()
                      if (data.success) {
                        form.setFieldsValue({ captchaKey: data.data.key })
                        message.success('验证码已发送')
                      } else {
                        message.error(data.message || '发送验证码失败')
                      }
                    } catch (err) {
                      message.error('网络错误')
                    }
                  }}
                >
                  获取验证码
                </Button>
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{
                display: 'flex',
                gap: '20px',
                width: '80%',
                marginLeft: '50px',
              }}>
                <Button
                  style={{
                    backgroundColor: '#232F3E',
                    borderRadius: '40px',
                    color: '#fefeff',
                    width: '50%',
                    height: '50px',
                    marginTop: '60px',
                  }}
                  htmlType="submit">
                  注册
                </Button>
                <Button
                  style={{
                    backgroundColor: '#f0f2f5',
                    borderRadius: '40px',
                    color: '#232F3E',
                    width: '50%',
                    height: '50px',
                    marginTop: '60px',
                    border: '1px solid #232F3E',
                  }}
                  onClick={() => navigate('/auth/login')}>
                  返回登录
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
