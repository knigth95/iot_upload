import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd' // 合并 antd 导入
import { useNavigate } from 'react-router-dom'
import { Register, GetCaptcha } from '@/api'
import './style.less'

export default function RegisterPage () {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(0) // 新增倒计时状态

  const onFinish = async (values: any) => {
    console.log('Register form values:', {
      username: values.username,
      email: values.email,
      captcha: values.captcha,
      captchaKey: values.captchaKey,
    })

    // 修改验证逻辑
    if (!values.captchaKey) {
      message.error('验证码已过期，请重新获取')
      return
    }
    if (!values.captcha) {
      message.error('请输入验证码')
      return
    }

    try {
      const resp = await Register({
        username: values.username,
        password: values.password,
        email: values.email,
        captcha: values.captcha,
        captchaKey: values.captchaKey,
      })
      console.log('Register request payload:', {
        username: values.username,
        email: values.email,
        captchaKey: values.captchaKey,
      })
      console.log('Register response:', resp)
      if (resp.success) {
        message.success('注册成功')
        navigate('/auth/login')
      } else {
        message.error(resp.errorMsg || '注册失败')
      }
    } catch (err: any) {
      console.error('Register error:', err)
      message.error(`注册请求失败: ${err?.message || '网络错误'}`)
    }
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
              initialValue=""
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
                  disabled={countdown > 0}
                  onClick={async () => {
                    const email = form.getFieldValue('email')
                    if (!email) {
                      message.error('请先输入邮箱')
                      return
                    }

                    // 开始倒计时
                    setCountdown(60)
                    const timer = setInterval(() => {
                      setCountdown((prev) => {
                        if (prev <= 1) {
                          clearInterval(timer)
                          return 0
                        }
                        return prev - 1
                      })
                    }, 1000)

                    message.loading({ content: '发送验证码中...', key: 'captcha', duration: 0 })

                    try {
                      const response = await GetCaptcha(email)
                      console.log('验证码响应:', response)

                      if (response?.success) {
                        // 确保设置captchaKey字段
                        form.setFieldsValue({
                            captchaKey: response.result?.key || '',
                            captcha: '',
                        })
                        console.log('验证码key已设置:', response.result?.key)
                        message.success({
                            content: '验证码已发送到您的邮箱，10分钟内有效',
                            key: 'captcha',
                            duration: 10,
                        })
                      }
                      else {
                        clearInterval(timer)
                        setCountdown(0)
                        message.error({
                          content: response?.errorMsg || '验证码发送失败',
                          key: 'captcha',
                        })
                      }
                    } catch (err: any) {
                      console.error('获取验证码错误:', err)
                      if (timer) clearInterval(timer)
                      setCountdown(0)
                      message.error({
                        content: err?.message || '网络连接异常，请检查网络后重试',
                        key: 'captcha',
                      })
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
