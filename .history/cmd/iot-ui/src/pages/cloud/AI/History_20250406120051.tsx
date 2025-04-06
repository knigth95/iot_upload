import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Typography,
  Space,
  Button,
  Tag,
  message,
  Empty,
} from 'antd'
import {
  HistoryOutlined,
  SyncOutlined,
  UserOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getAIQAHistory } from '@/api/ai'

interface QAHistoryItem {
  key: string;
  id: number;
  question: string;
  answer: string;
  model: string;
  timestamp: string;
}

const AIHistoryPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<QAHistoryItem[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const columns: ColumnsType<QAHistoryItem> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
    },
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <Typography.Text>{text}</Typography.Text>
        </Space>
      ),
    },
    {
      title: '回答',
      dataIndex: 'answer',
      key: 'answer',
      render: (text) => (
        <Space>
          <RobotOutlined style={{ color: '#52c41a' }} />
          <Typography.Text>{text}</Typography.Text>
        </Space>
      ),
    },
    {
      title: '模型',
      dataIndex: 'model',
      key: 'model',
      width: 180,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
  ]

  const fetchHistoryData = async () => {
    try {
      setLoading(true)
      const response = await getAIQAHistory()
      
      if (response && response.data) {
        const historyItems = response.data.map((item: any, index: number) => ({
          key: index.toString(),
          id: item.id,
          question: item.question,
          answer: item.answer,
          model: item.model || 'Unknown',
          timestamp: new Date(item.created_at || item.timestamp).toLocaleString(),
        }))
        
        setData(historyItems)
        setLastUpdated(new Date().toLocaleString())
      } else {
        setData([])
      }
    } catch (err) {
      console.error('Error fetching AI QA history:', err)
      message.error('获取AI问答历史失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistoryData()
  }, [])

  return (
    <Card
      title={
        <Space>
          <HistoryOutlined />
          <span>AI 问答历史</span>
        </Space>
      }
      extra={
        <Space>
          {lastUpdated && (
            <Typography.Text type="secondary">
              最后更新: {lastUpdated}
            </Typography.Text>
          )}
          <Button
            icon={<SyncOutlined />}
            loading={loading}
            onClick={fetchHistoryData}
          >
            刷新
          </Button>
        </Space>
      }
    >
      {data.length > 0 ? (
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '0 20px' }}>
                <Typography.Title level={5}>问题:</Typography.Title>
                <Typography.Paragraph>{record.question}</Typography.Paragraph>
                <Typography.Title level={5}>回答:</Typography.Title>
                <Typography.Paragraph>{record.answer}</Typography.Paragraph>
              </div>
            ),
          }}
        />
      ) : (
        <Empty
          description="暂无问答历史记录"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  )
}

export default AIHistoryPage
