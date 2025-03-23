import React, { useEffect } from 'react'
import { ConfigProvider, Spin } from 'antd'
import Layout from '@/components/Layout'
import './App.less'
import { useNavigate, useLocation } from 'react-router-dom'
import { getToken } from './utils/auth'

// 在顶部添加导入
import RegisterPage from '@/pages/auth/register'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  // 修改 useEffect 中的导航逻辑
  useEffect(() => {
    const path = location.pathname === '/' ? '/home/dashboard' : location.pathname
    if (!getToken() && !path.startsWith('/auth/register')) {
      navigate(`/auth/login?path=${encodeURIComponent(path)}`)
      return
    }
    if (location.pathname === '/') {
      navigate('/home/dashboard')
    }
  })

  return (











    <ConfigProvider>
      <Spin spinning={false}>

        <Layout>
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            {/* 其他路由配置... */}
          </Routes>
        </Layout>
      </Spin>
    </ConfigProvider>
  )
}

export default App
