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
  useEffect(() => {
    const mockDevices = [
      { id: 'device-001', name: '温度传感器-1' },
      { id: 'device-002', name: '湿度传感器-1' },
      { id: 'device-003', name: '压力传感器-1' }
    ]
    const mockProperties = ['温度', '湿度', '压力', '电压']
    setDevices(mockDevices)
    setProperties(mockProperties)
    generateMockData()
  }, [])

  // 生成模拟数据
  const generateMockData = () => {
    const mockData: DeviceData[] = devices.map(device => ({
      deviceId: device.id,
      deviceName: device.name,
      property: selectedProperties[0] || '温度',
      data: Array.from({ length: 100 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        value: Math.random() * 100
      }))
    }))
    setChartData(mockData)
    setTableData(formatTableData(mockData))
  }

  // 格式化表格数据
  const formatTableData = (data: DeviceData[]) => {
    return data.flatMap(device => 
      device.data.map(point => ({
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        property: device.property,
        timestamp: point.timestamp,
        value: point.value
      }))
    )
  }

  // 查询数据
  const handleQuery = async () => {
    setLoading(true)
    try {
      if (activeTab === 'single') {
        const res = await queryDeviceHistory({
          deviceId: selectedDevices[0],
          property: selectedProperties[0],
          startTime: dateRange[0],
          endTime: dateRange[1]
        })
        setChartData([res.data])
        setTableData(formatTableData([res.data]))
      } else {
        const res = await queryCompareHistory({
          devices: selectedDevices.map(id => ({
            deviceId: id,
            property: selectedProperties[0]
          })),
          startTime: dateRange[0],
          endTime: dateRange[1]
        })
        setChartData(res.data)
        setTableData(formatTableData(res.data))
      }
    } catch (err) {
      message.error('查询失败')
    } finally {
      setLoading(false)
    }
  }

  // 初始化图表
  useEffect(() => {
    const chartDom = document.getElementById('history-chart')
    if (!chartDom) return
    
    const myChart = echarts.init(chartDom)
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: chartData.map(d => `${d.deviceName}-${d.property}`)
      },
      xAxis: {
        type: 'category',
        data: chartData[0]?.data.map(d => new Date(d.timestamp).toLocaleString()) || []
      },
      yAxis: {
        type: 'value'
      },
