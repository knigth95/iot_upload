import React, { useState, useEffect } from 'react'
import {
  Card,
  Tabs,
  DatePicker,
  Button,
  Table,
  Space,
  Select,
  message,
} from 'antd'
import {
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type {
  XAXisOption,
  YAXisOption,
  SeriesOption,
  EChartsOption,
} from 'echarts/types/dist/shared'
import { exportToCSV, exportToJSON, exportToExcel } from '@/utils/export'
import { queryDeviceHistory, queryCompareHistory } from '@/api/historyQuery'
import type { ColumnsType } from 'antd/es/table'

echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
])

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
      { id: 'device-003', name: '压力传感器-1' },
    ]
    const mockProperties = ['温度', '湿度', '压力', '网络']
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
        value: Math.random() * 100,
      })),
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
        value: point.value,
      })),
    )
  }

  // 查询数据
  const handleQuery = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      message.error('请选择时间范围')
      return
    }
    if (selectedDevices.length === 0) {
      message.error('请选择设备')
      return
    }
    if (selectedProperties.length === 0) {
      message.error('请选择属性')
      return
    }

    setLoading(true)
    try {
      let res
      if (activeTab === 'single') {
        res = await queryDeviceHistory({
          deviceId: selectedDevices[0],
          properties: selectedProperties,
          startTime: dateRange[0],
          endTime: dateRange[1],
        })
        setChartData([res.data])
        setTableData(formatTableData([res.data]))
      } else {
        res = await queryCompareHistory({
          devices: selectedDevices.map(id => ({
            deviceId: id,
            properties: selectedProperties,
          })),
          startTime: dateRange[0],
          endTime: dateRange[1],
        })
        setChartData(res.data)
        setTableData(formatTableData(res.data))
      }
      message.success('查询成功')
    } catch (err) {
      console.error('查询错误:', err)
      message.error('查询失败: ' + ((err as Error).message || '未知错误'))
    } finally {
      setLoading(false)
    }
  }

  // 初始化图表
  useEffect(() => {
    const chartDom = document.getElementById('history-chart')
    if (!chartDom) return

    const myChart = echarts.init(chartDom)
    const option: EChartsOption = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: chartData.map(d => `${d.deviceName}-${d.property}`),
      },
      xAxis: {
        type: 'category',
        data: chartData[0]?.data.map(d => new Date(d.timestamp).toLocaleString()) || [],
      } as XAXisOption,
      yAxis: {
        type: 'value',
      } as YAXisOption,
      series: chartData.map(d => ({
        name: `${d.deviceName}-${d.property}`,
        type: 'line',
        data: d.data.map(p => p.value),
        smooth: true,
      })) as SeriesOption[],
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 100,
        },
      ],
    }
    myChart.setOption(option)

    return () => {
      myChart.dispose()
    }
  }, [chartData])

  // 导出数据
  const handleExport = (type: 'csv' | 'json' | 'excel') => {
    if (tableData.length === 0) {
      message.warning('没有数据可导出')
      return
    }

    switch (type) {
      case 'csv':
        exportToCSV(tableData, 'history-data')
        break
      case 'json':
        exportToJSON(tableData, 'history-data')
        break
      case 'excel':
        exportToExcel(tableData, 'history-data')
        break
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '属性',
      dataIndex: 'property',
      key: 'property',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
    },
  ]

  return (
    <Card
      title="历史数据查询"
      extra={
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleExport('csv')}
          >
            CSV
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleExport('json')}
          >
            JSON
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleExport('excel')}
          >
            Excel
          </Button>
        </Space>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarExtraContent={
          <Space>
            <RangePicker
              showTime
              onChange={(dates, dateStrings) => setDateRange(dateStrings as [string, string])}
            />
            <Select
              mode={activeTab === 'compare' ? 'multiple' : undefined}
              style={{ width: 200 }}
              placeholder="选择设备"
              onChange={setSelectedDevices}
            >
              {devices.map(device => (
                <Option key={device.id} value={device.id}>
                  {device.name}
                </Option>
              ))}
            </Select>
            <Select
              style={{ width: 120 }}
              placeholder="选择属性"
              mode="multiple"
              onChange={value => setSelectedProperties(value)}
            >
              {properties.map(prop => (
                <Option key={prop} value={prop}>
                  {prop}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleQuery}
              loading={loading}
            >
              查询
            </Button>
          </Space>
        }
      >
        <Tabs.TabPane tab="单设备查询" key="single">
          <div id="history-chart" style={{ height: 400 }} />
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="timestamp"
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="多设备对比" key="compare">
          <div id="history-chart" style={{ height: 400 }} />
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="timestamp"
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default HistoryQuery
