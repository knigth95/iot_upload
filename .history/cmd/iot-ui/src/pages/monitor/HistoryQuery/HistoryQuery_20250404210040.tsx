'use client'

interface Device {
  device_id: string;
  device_name: string;
}

interface Property {
  property_id: string;
  property_name: string;
}

interface DataPoint {
  timestamp: string;
  value: number;
}

interface QueryResult {
  success: boolean;
  data: DataPoint[];
  error?: string;
}

interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  tension: number;
}

interface TableRow {
  timestamp: string;
  device: string;
  property: string;
  value: number;
}

import React, { useState } from 'react'
import { Table, Card, Tabs, Button, Select, Input, Form } from 'antd'
import { CloseOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons'
const { Column } = Table
const { TabPane } = Tabs
const { Option } = Select
import {
  queryDevicePropertyHistory,
  queryMultipleDeviceProperties,
  getDeviceList,
  getDeviceProperties,
} from '@/api/history-data'
import HistoryChart from './history-chart'

interface Device {
  device_id: string
  device_name: string
}

interface Property {
  property_id: string
  property_name: string
}

export default function HistoryQueryPage () {
  const [activeTab, setActiveTab] = useState('single')
  const [devices, setDevices] = useState<Device[]>([])
  const [properties, setProperties] = useState<Record<string, Property[]>>({})
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState<{
    labels: string[]
    datasets: ChartDataset[]
  } | null>(null)
  const [tableData, setTableData] = useState<TableRow[]>([])

  // 单设备查询状态
  const [selectedDevice, setSelectedDevice] = useState('')
  const [selectedProperty, setSelectedProperty] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  // 多设备对比查询状态
  const [compareQueries, setCompareQueries] = useState([{ id: 1, deviceId: '', propertyId: '', label: '设备1' }])
  const [compareStartTime, setCompareStartTime] = useState('')
  const [compareEndTime, setCompareEndTime] = useState('')

  // 加载设备列表
  const loadDevices = async () => {
    try {
      const result = await getDeviceList()
      if (result.success) {
        setDevices(result.data)
      }
    } catch (error) {
      console.error('加载设备列表失败:', error)
    }
  }

  // 加载设备属性
  const loadProperties = async (deviceId: string) => {
    try {
      const result = await getDeviceProperties(deviceId)
      if (result.success) {
        setProperties((prev) => ({
          ...prev,
          [deviceId]: result.data,
        }))
      }
    } catch (error) {
      console.error('加载设备属性失败:', error)
    }
  }

  // 处理设备选择变化
  const handleDeviceChange = async (deviceId: string) => {
    setSelectedDevice(deviceId)
    setSelectedProperty('')

    if (deviceId && !properties[deviceId]) {
      await loadProperties(deviceId)
    }
  }

  // 处理对比查询设备变化
  const handleCompareDeviceChange = async (index: number, deviceId: string) => {
    const updatedQueries = [...compareQueries]
    updatedQueries[index].deviceId = deviceId
    updatedQueries[index].propertyId = ''
    setCompareQueries(updatedQueries)

    if (deviceId && !properties[deviceId]) {
      await loadProperties(deviceId)
    }
  }

  // 添加对比项
  const addCompareItem = () => {
    setCompareQueries([
      ...compareQueries,
      {
        id: Date.now(),
        deviceId: '',
        propertyId: '',
        label: `设备${compareQueries.length + 1}`,
      },
    ])
  }

  // 移除对比项
  const removeCompareItem = (id: number) => {
    if (compareQueries.length > 1) {
      setCompareQueries(compareQueries.filter((item) => item.id !== id))
    }
  }

  // 执行单设备查询
  const handleSingleQuery = async () => {
    if (!selectedDevice || !selectedProperty || !startTime || !endTime) {
      alert('请填写完整查询条件')
      return
    }

    setLoading(true)
    try {
      const result = await queryDevicePropertyHistory(selectedDevice, selectedProperty, startTime, endTime)

      if (result.success && result.data) {
        const deviceName = devices.find((d: Device) => d.device_id === selectedDevice)?.device_name || '未知设备'
        const propertyName = properties[selectedDevice]?.find(
          (p: Property) => p.property_id === selectedProperty
        )?.property_name || '未知属性'

        // 设置图表数据
        const chartData = {
          labels: result.data.map((item: DataPoint) => new Date(item.timestamp).toLocaleString()),
          datasets: [
            {
              label: `${deviceName} - ${propertyName}`,
              data: result.data.map((item: DataPoint) => item.value),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            } as ChartDataset
          ]
        }
        setChartData(chartData)

        // 设置表格数据
        const tableData = result.data.map((item: DataPoint) => ({
          timestamp: new Date(item.timestamp).toLocaleString(),
          device: deviceName,
          property: propertyName,
          value: item.value,
        })) as TableRow[]
        setTableData(tableData)
      } else {
        alert('查询失败: ' + result.error)
      }
    } catch (error) {
      console.error('查询失败:', error)
      alert('查询失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  // 执行多设备对比查询
  const handleCompareQuery = async () => {
    // 验证所有查询条件都已填写
    const isValid = compareQueries.every((q) => q.deviceId && q.propertyId) && compareStartTime && compareEndTime

    if (!isValid) {
      alert('请填写完整查询条件')
      return
    }

    setLoading(true)
    try {
      // 准备查询参数
      const queries = compareQueries.map((q) => {
        const deviceName = devices.find((d) => d.device_id === q.deviceId)?.device_name || '未知设备'
        const propertyName
          = properties[q.deviceId]?.find((p) => p.property_id === q.propertyId)?.property_name || '未知属性'

        return {
          deviceId: q.deviceId,
          propertyId: q.propertyId,
          label: `${deviceName} - ${propertyName}`,
        }
      })

      const result = await queryMultipleDeviceProperties(queries, compareStartTime, compareEndTime)

      if (result.success) {
        // 处理返回的数据
        interface Dataset {
          label: string
          data: number[]
          borderColor: string
          tension: number
        }
        
        const datasets: Dataset[] = []
        const tableRows: TableRow[] = []
        const resultData = result.data as Record<string, DataPoint[]>

        // 获取所有时间戳
        const allTimestamps = new Set<string>()
        Object.values(resultData).forEach((series: DataPoint[]) => {
          series.forEach((point: DataPoint) => {
            allTimestamps.add(point.timestamp)
          })
        })

        // 排序时间戳
        const sortedTimestamps = Array.from(allTimestamps).sort()

        // 为每个查询创建数据集
        Object.entries(resultData).forEach(([label, series], index) => {
          // 为图表创建数据集
          const dataset = {
            label,
            data: (series as DataPoint[]).map(item => item.value),
            borderColor: getColorByIndex(index),
            tension: 0.1
          } as Dataset
          datasets.push(dataset)

          // 为表格创建行
          (series as DataPoint[]).forEach((point) => {
            tableRows.push({
              timestamp: new Date(point.timestamp).toLocaleString(),
              device: label.split(' - ')[0],
              property: label.split(' - ')[1],
              value: point.value,
            } as TableRow)
          })
        })

        // 设置图表数据
        setChartData({
          labels: (sortedTimestamps as string[]).map((ts) => new Date(ts).toLocaleString()),
          datasets,
        })

        // 设置表格数据（按时间排序）
        setTableData(tableRows.sort((a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ))
      } else {
        alert('查询失败: ' + result.error)
      }
    } catch (error) {
      console.error('对比查询失败:', error)
      alert('对比查询失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  // 导出数据为CSV
  const exportToCSV = () => {
    if (!tableData.length) return

    const headers = Object.keys(tableData[0]).join(',')
    const rows = tableData.map((row) => Object.values(row).join(','))
    const csv = [headers, ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `历史数据_${new Date().toISOString()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 根据索引获取颜色
  const getColorByIndex = (index: number) => {
    const colors = [
      'rgb(75, 192, 192)',
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)',
    ]
    return colors[index % colors.length]
  }

  // 初始化加载设备列表
  useState(() => {
    loadDevices()
  }, [])

  return (
    <div className="container mx-auto py-6">
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="w-full">

        <TabPane tab="单设备查询" key="single">
          <Card title="单设备属性查询">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="ant-form-item-label">
                    <label>设备</label>
                  </div>
                  <Select
                    value={selectedDevice}
                    onChange={handleDeviceChange}
                    placeholder="选择设备"
                    style={{width: '100%'}}
                  >
                    {devices.map((device) => (
                      <Option key={device.device_id} value={device.device_id}>
                        {device.device_name}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="ant-form-item-label">
                    <label>属性</label>
                  </div>
                  <Select
                    value={selectedProperty}
                    onChange={setSelectedProperty}
                    disabled={!selectedDevice}
                    placeholder="选择属性"
                    style={{width: '100%'}}
                  >
                    {properties[selectedDevice]?.map((prop) => (
                      <Option key={prop.property_id} value={prop.property_id}>
                        {prop.property_name}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Form.Item label="开始时间">
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </Form.Item>
                </div>

                <div className="space-y-2">
                  <Form.Item label="结束时间">
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </Form.Item>
                </div>
              </div>

              <Button onClick={handleSingleQuery} disabled={loading} className="w-full">
                {loading ? '查询中...' : '查询'}
              </Button>
            </div>
          </Card>
        </TabPane>

        <Tabs.TabPane tab="多设备对比" key="compare">
          <Card title="多设备对比查询">
            <div className="p-6">
              {compareQueries.map((query, index) => (
                <div key={query.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                  <div className="space-y-2">
                    <Form.Item label={`设备 ${index + 1}`}>
                      <Select
                        value={query.deviceId}
                        onChange={(value) => handleCompareDeviceChange(index, value)}
                        style={{width: '100%'}}
                      >
                        {devices.map((device) => (
                          <Option key={device.device_id} value={device.device_id}>
                            {device.device_name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  <Select
                    value={query.deviceId}
                    onChange={(value) => handleCompareDeviceChange(index, value)}
                    placeholder="选择设备"
                    style={{width: '100%'}}
                  >
                    {devices.map((device) => (
                      <Option key={device.device_id} value={device.device_id}>
                        {device.device_name}
                      </Option>
                    ))}
                  </Select>
                  </div>

                  <div className="space-y-2">
                    <Form.Item label="属性">
                      <Select
                        value={query.propertyId}
                        onChange={(value) => {
                          const updated = [...compareQueries]
                          updated[index].propertyId = value
                          setCompareQueries(updated)
                        }}
                        disabled={!query.deviceId}
                        style={{width: '100%'}}
                      >
                        {properties[query.deviceId]?.map((prop) => (
                          <Option key={prop.property_id} value={prop.property_id}>
                            {prop.property_name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Select
                      value={query.propertyId}
                      onChange={(value) => {
                        const updated = [...compareQueries]
                        updated[index].propertyId = value
                        setCompareQueries(updated)
                      }}
                      disabled={!query.deviceId}
                      placeholder="选择属性"
                      style={{width: '100%'}}
                    >
                      {properties[query.deviceId]?.map((prop) => (
                        <Option key={prop.property_id} value={prop.property_id}>
                          {prop.property_name}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <div className="flex items-center">
                    <Button
                      type="text"
                      shape="circle"
                      icon={<CloseOutlined />}
                      onClick={() => removeCompareItem(query.id)}
                      disabled={compareQueries.length <= 1}
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-between mb-4">
                <Button
                  type="dashed"
                  onClick={addCompareItem}
                  icon={<PlusOutlined />}
                >
                  添加对比项
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Form.Item label="开始时间">
                    <Input
                      id="compareStartTime"
                      type="datetime-local"
                      value={compareStartTime}
                      onChange={(e) => setCompareStartTime(e.target.value)}
                    />
                  </Form.Item>
                </div>

                <div className="space-y-2">
                  <Form.Item label="结束时间">
                    <Input
                      id="compareEndTime"
                      type="datetime-local"
                      value={compareEndTime}
                      onChange={(e) => setCompareEndTime(e.target.value)}
                    />
                  </Form.Item>
                </div>
              </div>

              <Button onClick={handleCompareQuery} disabled={loading} className="w-full">
                {loading ? '查询中...' : '查询'}
              </Button>
            </div>
          </Card>
        </Tabs.TabPane>
      </Tabs>

      {chartData && (
        <div className="mt-6 space-y-6">
          <Card>
            <Card
              title="查询结果"
              extra={
                <Button type="default" size="small" onClick={exportToCSV} icon={<DownloadOutlined />}>
                  导出CSV
                </Button>
              }
            >
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">图表展示</h3>
                <div className="h-[400px]">
                  <HistoryChart data={chartData} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">表格数据</h3>
                <div className="border rounded-md overflow-auto max-h-[400px]">
                  <Table dataSource={tableData}>
                    <Column title="时间" dataIndex="timestamp" key="timestamp" />
                    <Column title="设备" dataIndex="device" key="device" />
                    <Column title="属性" dataIndex="property" key="property" />
                    <Column title="数值" dataIndex="value" key="value" />
                  </Table>
                </div>
              </div>
            </div>
            </Card>
          </Card>
        </div>
      )}
    </div>
  )
}
