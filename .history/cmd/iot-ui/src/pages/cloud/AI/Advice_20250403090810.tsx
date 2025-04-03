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
        switch (level) {
          case 'high': color = 'red'; break
          case 'medium': color = 'orange'; break
          case 'low': color = 'green'; break
        }
        return <Tag color={color}>{level}</Tag>
      },
    },
    {
      title: '最后触发',
      dataIndex: 'lastTrigger',
      key: 'lastTrigger',
    },
    {
      title: '建议',
      dataIndex: 'suggestion',
      key: 'suggestion',
    },
  ]

  const fetchRiskData = async () => {
    try {
      setLoading(true)
      const mockData: RiskItem[] = [
        {
          key: '1',
          device: '温度传感器-001',
          property: '温度',
          riskLevel: 'high',
          lastTrigger: '2025-04-03 08:15:23',
          suggestion: '温度超过安全阈值，建议检查冷却系统',
        },
        {
          key: '2',
          device: '湿度传感器-002',
          property: '湿度',
          riskLevel: 'medium',
          lastTrigger: '2025-04-03 07:30:45',
          suggestion: '湿度波动较大，建议检查密封性',
        },
      ]
      setData(mockData)
      setLastUpdated(new Date().toLocaleString())
    } catch (err) {
      message.error('获取风险数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRiskData()
    const interval = setInterval(fetchRiskData, 2 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card
      title={
        <Space>
          <WarningOutlined />
          <span>设备风险分析</span>
        </Space>
      }
      extra={
        <Space>
          {lastUpdated && (
            <Typography.Text type="secondary">
              <ClockCircleOutlined /> 最后更新: {lastUpdated}
            </Typography.Text>
          )}
          <Button
            icon={<SyncOutlined />}
            loading={loading}
            onClick={fetchRiskData}
          >
            刷新
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
      />
    </Card>
  )
}

export default AIAdvicePage
