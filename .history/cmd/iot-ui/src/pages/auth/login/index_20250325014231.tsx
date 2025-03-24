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
    <div className="flex min-h-screen bg-white">
      {/* 左侧品牌区 - 保留原有内容仅修改容器样式 */}
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

      {/* 右侧表单区 - 保持原有逻辑仅修改样式 */}
      <div className="w-1/2 p-12 flex flex-col justify-center">
        {initInfo.data?.isInit ? (
          <div className="max-w-md w-full mx-auto">
            <div className="text-2xl font-medium mb-8">密码登录</div>
            <Form
              name="basic"



              onFinish={onFinish}


              className="space-y-6"
            >










              {/* 保留原有表单项，仅修改输入框样式 */}
              <Form.Item name="username" rules={[{ required: true }]}>
                <Input 
                  placeholder="账号" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
                />
              </Form.Item>












              <Form.Item name="password" rules={[{ required: true }]}>
                <Input.Password 
                  placeholder="密码"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
                />
              </Form.Item>
















              <Button
                htmlType="submit"
                className="w-full bg-[#232F3E] text-white px-6 py-3 rounded-full text-base font-medium hover:bg-[#1A202C]"
              >
                登录
              </Button>
            </Form>





          </div>
        ) : (
          <div className="max-w-md w-full mx-auto">
            <div className="text-2xl font-medium mb-8">初始化密码</div>
            <Form
              name="basic"



              onFinish={onInitFinish}


              className="space-y-6"
            >










              {/* 保留原有初始化密码表单逻辑，仅修改样式 */}
              <Form.Item name="newPassword" rules={[{ required: true }]}>
                <Input.Password 
                  placeholder="密码"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
                />
              </Form.Item>





















              <Form.Item name="password1" dependencies={['newPassword']}>
                <Input.Password 
                  placeholder="确认密码"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
                />
              </Form.Item>
















              <Button
                htmlType="submit"
                className="w-full bg-[#232F3E] text-white px-6 py-3 rounded-full text-base font-medium hover:bg-[#1A202C]"
              >
                确定
              </Button>
            </Form>


          </div>
        )}
      </div>
    </div>



    {/* 注册部分保持原有逻辑仅修改样式 */}
    {!initInfo.data?.isInit && (







      <div className="fixed bottom-10 right-10">
        <Button 
          onClick={() => navigate('/auth/register')}
          className="bg-white text-[#232F3E] px-6 py-2 rounded-full border border-[#232F3E] hover:bg-gray-100"
        >




















































          没有账号？立即注册
        </Button>
      </div>
    )}
  </>)
}
