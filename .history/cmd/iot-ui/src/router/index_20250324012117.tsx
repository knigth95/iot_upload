import React from 'react'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'

const router = createBrowserRouter([
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
])
