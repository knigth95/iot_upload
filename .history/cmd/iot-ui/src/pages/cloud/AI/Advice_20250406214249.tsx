import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Typography, message } from 'antd'
import {
  SyncOutlined,
  WarningOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getAIRecommendations } from '@/api/ai'

interface RiskItem {
  key: string;
  id: number;
  device: string;
  property: string;
  riskLevel: 'high' | 'medium' | 'low';
  lastTrigger: string;
  suggestion: string;
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
          case 'high':
            color = 'red'
            break
          case 'medium':
            color = 'orange'
            break
          case 'low':
            color = 'green'
            break
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
      const response = await getAIRecommendations()

      // 转换后端数据为前端展示格式
      const riskData: RiskItem[] = []

      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((item: any) => {
          // 从内容中提取设备和属性信息
          const titleParts = item.title.split('-')
          const device
            = titleParts.length > 0 ? titleParts[0].trim() : '未知设备'
          const property = item.property_id
            = titleParts.length > 1 ? titleParts[1].trim() : '未知属性'

          riskData.push({
            key: item.id.toString(),
            id: item.id,
            device,
            property,
            riskLevel: item.risk_level as 'high' | 'medium' | 'low',
            lastTrigger: item.timestamp,
            suggestion: item.content,
          })
        })
      }

      setData(riskData)
      setLastUpdated(new Date().toLocaleString())
    } catch (err) {
      console.error('Error fetching AI recommendations:', err)
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
