import React, { useState, useRef, useEffect } from 'react'
import {
  Card,
  Input,
  Button,
  List,
  Avatar,
  Typography,
  Spin,
  message,
} from 'antd'
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons'
import { getAIResponse } from '@/api/ai'
import type { AIRequestParams } from '@/types/ai'

const { TextArea } = Input
const { Title, Paragraph } = Typography

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

const AIQAPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: '您好！我是AI助手，请问有什么可以帮您？',
      sender: 'ai',
      timestamp: new Date().toLocaleString(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || loading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      // 准备请求参数
      const params: AIRequestParams = {
        prompt: inputValue,
        model: 'deepseek-chat',
      }
      // 在获取响应前等待500ms
      await new Promise(resolve => setTimeout(resolve, 1000))
      const response = await getAIResponse(params)
      // 检查响应是否成功
      if (response.data.code !== 200) {
        throw new Error(response.data.message || '获取AI回复失败')
      }

      // 提取AI回复
      const aiContent = response.data.data?.answer || response.data.data?.answer
      || response.data.data?.content || response.data.data?.content
      || '未获取到有效回复'
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        content: aiContent,
        sender: 'ai',
        timestamp: new Date().toLocaleString(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      message.error('获取AI回复失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  // 处理按键事件
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RobotOutlined style={{ marginRight: 8 }} />
          <span>AI 问答助手</span>
        </div>
      }
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, overflow: 'auto', marginBottom: 16 }}>
        {messages.length === 0
          ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Title level={4}>欢迎使用AI问答助手</Title>
              <Paragraph>您可以向我询问关于设备、数据和系统的任何问题</Paragraph>
            </div>
          )
          : (
            <List
              itemLayout="horizontal"
              dataSource={messages}
              renderItem={(item) => (
                <List.Item
                  style={{
                    justifyContent:
                    item.sender === 'user' ? 'flex-end' : 'flex-start',
                    padding: '8px 16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection:
                      item.sender === 'user' ? 'row-reverse' : 'row',
                      maxWidth: '80%',
                    }}
                  >
                    <Avatar
                      icon={
                        item.sender === 'user'
                          ? (
                            <UserOutlined />
                          )
                          : (
                            <RobotOutlined />
                          )
                      }
                      style={{
                        backgroundColor:
                        item.sender === 'user' ? '#1890ff' : '#52c41a',
                        marginLeft: item.sender === 'user' ? 8 : 0,
                        marginRight: item.sender === 'user' ? 0 : 8,
                      }}
                    />
                    <div
                      style={{
                        background:
                        item.sender === 'user' ? '#e6f7ff' : '#f6ffed',
                        padding: '8px 12px',
                        borderRadius: 8,
                        position: 'relative',
                      }}
                    >
                      <div>{item.content}</div>
                      <div
                        style={{
                          fontSize: 12,
                          color: '#999',
                          marginTop: 4,
                          textAlign: item.sender === 'user' ? 'right' : 'left',
                        }}
                      >
                        {item.timestamp}
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', marginTop: 'auto' }}>
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入您的问题..."
          autoSize={{ minRows: 2, maxRows: 4 }}
          disabled={loading}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          type="primary"
          icon={loading ? <Spin size="small" /> : <SendOutlined />}
          onClick={handleSend}
          disabled={loading || !inputValue.trim()}
        >
          发送
        </Button>
      </div>
    </Card>
  )
}

export default AIQAPage
