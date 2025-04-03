import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Typography, message } from 'antd'
import { SyncOutlined, WarningOutlined, ClockCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface RiskItem {
  key: string
  device: string
  property: string
  riskLevel: 'high' | 'medium' | 'low'
  lastTrigger: string
  suggestion: string
}

const AIAdvicePage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<RiskItem[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>()

  const columns: ColumnsType<RiskItem> = [
    {
      title: '设备',
      dataIndex: 'device',
      key: 'device',
    },
    {
      title: '属性',
      dataIndex: 'property',
      key: 'property',
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (level) => {
        let color = ''
        switch(level) {
          case 'high': color = 'red'; break
          case 'medium': color = 'orange'; break
          case 'low': color = 'green'; break
        }
        return <Tag color={color}>{level}</Tag>
      }
    },
    {
      title: '最后触发',
      dataIndex: 'lastTrigger',
      key: 'lastTrigger',
