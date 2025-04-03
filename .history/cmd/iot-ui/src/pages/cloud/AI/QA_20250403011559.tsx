import React, { useState } from 'react'
import { Card, Input, Button, List, Avatar } from 'antd'
import { MessageOutlined, UserOutlined } from '@ant-design/icons'

interface Message {
  id: string
  content: string
  isUser: boolean
}

const AIQAPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', content: '您好！我是AI助手，请问有什么可以帮您？', isUser: false }
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (!inputValue.trim()) return
    
    const newUserMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true
    }
    
    setMessages([...messages, newUserMessage])
    setInputValue('')
    
    // 模拟AI回复
    setTimeout(() => {
      const aiReply = {
        id: (Date.now() + 1).toString(),
        content: '我已收到您的提问，正在处理中...',
        isUser: false
      }
      setMessages(prev => [...prev, aiReply])
    }, 1000)
  }

  return (
    <Card title="AI问答">
      <div style={{ height: '500px', overflowY: 'auto', marginBottom: '16px' }}>
        <List
          dataSource={messages}
          renderItem={item => (
            <List.Item style={{ 
              justifyContent: item.isUser ? 'flex-end' : 'flex-start',
              padding: '8px 0'
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                maxWidth: '80%'
              }}>
                {!item.isUser && <Avatar icon={<MessageOutlined />} style={{ marginRight: '8px' }} />}
                <div style={{ 
                  background: item.isUser ? '#1890ff' : '#f0f0f0',
                  color: item.isUser ? '#fff' : '#000',
                  padding: '8px 12px',
                  borderRadius: '4px'
                }}>
                  {item.content}
                </div>
                {item.isUser && <Avatar icon={<UserOutlined />} style={{ marginLeft: '8px' }} />}
              </div>
            </List.Item>
          )}
        />
      </div>
      <Input.Group compact style={{ display: 'flex' }}>
        <Input 
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onPressEnter={handleSend}
          placeholder="输入您的问题..."
          style={{ flex: 1 }}
        />
        <Button type="primary" onClick={handleSend}>发送</Button>
      </Input.Group>
    </Card>
  )
}

export default AIQAPage