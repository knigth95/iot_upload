import React from 'react'
import { Card, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { History } from '@/api/device-thingmodel'

const HistoryQuery: React.FC = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '单设备查询',
      children: '单设备属性历史数据查询',
    },
    {
      key: '2',
      label: '多设备对比',
      children: '多设备属性对比查询',
    },
  ]

  return (
    <Card title="历史数据查询">
      <Tabs defaultActiveKey="1" items={items} />
    </Card>
  )
}

export default HistoryQuery
