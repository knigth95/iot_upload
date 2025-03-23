// 添加 React 基础导入
import React from 'react'

// 已有其他导入保持不变
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'

const router = createBrowserRouter([
  {
    path: '/auth/register',

    element: <RegisterPage />, // 现在已正确识别 JSX 语法
  },
])
