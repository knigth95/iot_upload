'use client'

import React from 'react'
import { Table } from 'antd'
import type { TableProps } from 'antd'

interface TableData {
  timestamp: string
  device: string
  property: string
  value: string | number
  [key: string]: any
}

const columns: TableProps<TableData>['columns'] = [
  {
    title: '时间',
    dataIndex: 'timestamp',
    key: 'timestamp',
  },
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
    title: '数值',
    dataIndex: 'value',
    key: 'value',
  }
]

interface Props {
  data: TableData[]
}

export default function HistoryTable ({ data }: Props) {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">暂无数据</div>
  }

  return (
    <div className="border rounded-md overflow-auto max-h-[400px]">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: 400 }}
        rowKey={(record, index) => `${index}`}
        locale={{
          emptyText: <div className="text-center py-4">暂无数据</div>,
        }}
      />
    </div>
  )
}
