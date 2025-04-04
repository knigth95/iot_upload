import React, { useState, useEffect } from 'react'
import { Card, Tabs, DatePicker, Button, Table, Space, Select, message } from 'antd'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import * as echarts from 'echarts'
import { exportToCSV, exportToJSON, exportToExcel } from '@/utils/export'
import { queryDeviceHistory, queryCompareHistory } from '@/api/historyQuery'
import type { RangePickerProps } from 'antd/es/date-picker'
import type { ColumnsType } from 'antd/es/table'

const { RangePicker } = DatePicker
const { Option } = Select

interface DataPoint {
  timestamp: string
  value: number | string
}

interface DeviceData {
  deviceId: string
  deviceName: string
  property: string
  data: DataPoint[]
}

const HistoryQuery: React.FC = () => {
  const [activeTab, setActiveTab] = useState('single')
  const [loading, setLoading] = useState(false)
  const [devices, setDevices] = useState<Array<{id: string, name: string}>>([])
  const [properties, setProperties] = useState<string[]>([])
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<[string, string]>(['', ''])
  const [chartData, setChartData] = useState<DeviceData[]>([])
  const [tableData, setTableData] = useState<any[]>([])

  // 初始化模拟设备数据
