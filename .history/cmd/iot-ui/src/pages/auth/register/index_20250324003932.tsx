import { Button, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Register } from '@/api/login'
import './style.less'

export default function RegisterPage() {
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
    <div className="login">
      <div className="login-content">
        <div className="login-content__right">
          <div className="login-content__rightTitle">用户注册</div>
          <Form
            name="register"
            onFinish={onFinish}
            className="login-form"
            style={{ margin: '80px 80px' }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="用户名" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="密码" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '邮箱格式不正确' }
              ]}
            >
              <Input placeholder="邮箱" />
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
                htmlType="submit"
              >
                立即注册
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
