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
        // 确保response.data是一个数组
        const dataArray = Array.isArray(response.data) ? response.data : []
        const historyItems = dataArray.map((item: any, index: number) => ({
          key: index.toString(),
          id: item.id || index,
          question: item.question || '',
          answer: item.answer || '',
          model: item.model || 'Unknown',
          timestamp: item.created_at
            ? new Date(item.created_at).toLocaleString()
            : item.timestamp
              ? new Date(item.timestamp).toLocaleString()
              : new Date().toLocaleString(),
        }))

        setData(historyItems)
        setLastUpdated(new Date().toLocaleString())
      } else {
        console.log('No data or invalid response format:', response)
        // 使用模拟数据以便测试
        const mockData = [
          {
            key: '1',
            id: 1,
            question: '设备温度过高怎么办？',
            answer:
              '建议检查设备的散热系统，确保通风口无堵塞，并将设备放置在通风良好的环境中。如果问题仍然存在，可能需要检查温度传感器是否正常工作。',
            model: 'DeepSeek-V3',
            timestamp: new Date().toLocaleString(),
          },
          {
            key: '2',
            id: 2,
            question: '如何提高设备的数据采集频率？',
            answer:
              '提高设备的数据采集频率可以通过以下方式：1. 在设备配置中调整采集间隔；2. 确保网络连接稳定；3. 优化设备存储和处理能力；4. 考虑使用边缘计算来减少数据传输量。',
            model: 'DeepSeek-V3',
            timestamp: new Date(Date.now() - 86400000).toLocaleString(),
          },
        ]
        setData(mockData)
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
      {data.length > 0
        ? (
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
        )
        : (
          <Empty
            description="暂无问答历史记录"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
    </Card>
  )
}

export default AIHistoryPage
