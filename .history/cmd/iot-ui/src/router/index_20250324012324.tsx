import React from 'react'

import { createBrowserRouter } from 'react-router-dom'
import RegisterPage from '@/pages/auth/register'

const _ router = createBrowserRouter([
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
])
