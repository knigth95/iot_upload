import { Login, getInitInfo, initPassword, Register } from '@/api'
import useRequest from '@/hooks/useRequest'
import { setUser } from '@/utils/auth'
import { Button, Form, Input, message } from 'antd'
import React, { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './style.less'

export default function login () {
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const initInfo = useRequest(getInitInfo)

  // console.log(initInfo.data?.isInit)

  console.log(search)
  const loginSuccess = useCallback(() => {
    const path = search.get('path') || '/home/dashboard'
    navigate(path)
  }, [])

  const onFinish = (values: any) => {
    Login(values)
      .then(resp => {
        if (resp.success) {
          setUser(resp.result)
          loginSuccess()
        } else {
          message.error(resp.errorMsg)
        }
      })
  }

  const onInitFinish = (values: any) => {
    values.password1 = undefined
    initPassword(values)
      .then(resp => {
        if (resp.success) {
          message.success('初始化密码成功')
          initInfo.reload()
        } else {
          message.error(resp.errorMsg)
        }
      })
  }

  const onRegisterFinish = (values: any) => {
    Register(values).then(resp => {
      if (resp.success) {
        message.success('注册成功')
        navigate('/login') // 直接跳转登录页，不需要密码字段
      }
    })
  }

  return (<>
    <div className="login">
      <div className="login-content">
        <div className="login-content__left">
          <div className="login-content__leftTitle" style={{ marginTop: '40px' }}>
             iot平台
          </div>
          {/* <img
            className="login-content__img"
            src={require('@/assets/images/background.png')}
            alt="" /> */}
        </div>
        {initInfo.data?.isInit
          ? (<div className="login-content__right">
            <div className="login-content__rightTitle">
              密码登录
            </div>
            <Form
              name="basic"
              style={{
                margin: '80px 80px',
              }}
              onFinish={onFinish}
              autoComplete="off"
              className="login-form"
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: '请输入',
                  },
                ]}
              >
                <Input placeholder="账号" />
              </Form.Item>

              <Form.Item
                name="password"
                style={{ marginTop: '60px' }}
                rules={[
                  {
                    required: true,
                    message: '请输入',
                  },
                ]}
              >
                <Input.Password placeholder="密码" />
              </Form.Item>

              <Form.Item>
                <Button
                  style={{
                    backgroundColor: '#232F3E',
                    borderRadius: '40px',
                    color: '#fefeff',
                    width: '80%',
                    height: '50px',
                    marginTop: '60px',
                    marginLeft: '50px',
                  }}
                  htmlType="submit">
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>)
          : (<div className="login-content__right">
            <div className="login-content__rightTitle">
              初始化密码
            </div>
            <Form
              name="basic"
              style={{
                margin: '80px 80px',
              }}
              onFinish={onInitFinish}
              autoComplete="off"
              className="login-form"
            >
              <Form.Item
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: '请输入',
                  },
                ]}
              >
                <Input placeholder="密码" />
              </Form.Item>
              <Form.Item
                name="password1"
                style={{ marginTop: '60px' }}
                dependencies={['newPassword']}
                rules={[
                  {
                    required: true,
                    message: '请输入',
                  },
                  ({ getFieldValue }) => ({
                    validator (_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('两次密码输⼊不⼀致'))
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="确认密码" />
              </Form.Item>

              <Form.Item>
                <Button
                  style={{
                    backgroundColor: '#232F3E',
                    borderRadius: '40px',
                    color: '#fefeff',
                    width: '80%',
                    height: '50px',
                    marginTop: '60px',
                    marginLeft: '50px',
                  }}
                  htmlType="submit">
                  确定
                </Button>
              </Form.Item>
            </Form>
          </div>)
        }
      </div>

      <div className="login-copyright">Copyright © 2024-2025 knight</div>
    </div>
    {!initInfo.data?.isInit && (
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

          // 在表单底部添加
          <Form.Item>
            <Button
              type="link" 
              onClick={() => navigate('/auth/register')}
              style={{ marginTop: 16 }}
            >
              没有账号？立即注册
            </Button>
          </Form.Item>
          <Button
            style={{
              backgroundColor: '#f0f2f5',
              borderRadius: '40px',
              color: '#232F3E',
              width: '80%',
              height: '50px',
              marginTop: '20px',
              marginLeft: '50px',
              border: '1px solid #232F3E',
            }}
            onClick={() => navigate('/auth/register')}
          >
            注册
          </Button>

          <Button type="primary" htmlType="submit">注册</Button>
        </Form>
      </div>
    )}
  </>)
}
