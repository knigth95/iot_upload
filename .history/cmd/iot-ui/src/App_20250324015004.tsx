import React, { useEffect } from 'react'
import { ConfigProvider, Spin } from 'antd'
import Layout from '@/components/Layout'
import './App.less'
import { useNavigate, useLocation } from 'react-router-dom'
import { getToken } from './utils/auth'
// import { NUseRequest as useRequest } from '@/hooks/useRequest'

function App () {
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    // 当访问根路径时直接跳转仪表盘
    if (location.pathname === '/') {
      navigate('/home/dashboard')
      return
    }
    const path = location.pathname === '/' ? '/home/dashboard' : location.pathname
    if (location.pathname === '/auth/register') return
    if (!getToken()) {
      navigate(`/auth/login?path=${encodeURIComponent(path)}`) 
      return
    }
  }, [location, navigate]) // 添加依赖项

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 12,
          borderRadius: 4,
          colorPrimary: '#172c4d',
          colorBgLayout: '#fafafa',
          colorBorderSecondary: '#e7eaef',
        },
      }}
    >
      <Spin spinning={false}>
        <Layout></Layout>
      </Spin>
    </ConfigProvider>
  )
}

export default App
