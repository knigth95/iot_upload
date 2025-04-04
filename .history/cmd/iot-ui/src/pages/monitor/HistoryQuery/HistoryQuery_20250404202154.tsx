'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/api/ui/table'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/api/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/api/ui/tabs'
import { Button } from '@/api/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/api/ui/select'
import { Input } from '@/api/ui/input'
import { Label } from '@/api/ui/label'
import { PlusCircle, Download, X } from 'lucide-react'
import {
  queryDevicePropertyHistory,
  queryMultipleDeviceProperties,
  getDeviceList,
  getDeviceProperties,
} from '@/api/history-data'
import HistoryChart from './history-chart'

export default function HistoryQueryPage () {
  const [activeTab, setActiveTab] = useState('single')
  const [devices, setDevices] = useState([])
  const [properties, setProperties] = useState({})
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState(null)
  const [tableData, setTableData] = useState([])

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
  const loadProperties = async (deviceId) => {
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
  const handleDeviceChange = async (deviceId) => {
    setSelectedDevice(deviceId)
    setSelectedProperty('')

    if (deviceId && !properties[deviceId]) {
      await loadProperties(deviceId)
    }
  }

  // 处理对比查询设备变化
  const handleCompareDeviceChange = async (index, deviceId) => {
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
  const removeCompareItem = (id) => {
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

      if (result.success) {
        const deviceName = devices.find((d) => d.device_id === selectedDevice)?.device_name || '未知设备'
        const propertyName
          = properties[selectedDevice]?.find((p) => p.property_id === selectedProperty)?.property_name || '未知属性'

        // 设置图表数据
        setChartData({
          labels: result.data.map((item) => new Date(item.timestamp).toLocaleString()),
          datasets: [
            {
              label: `${deviceName} - ${propertyName}`,
              data: result.data.map((item) => item.value),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        })

        // 设置表格数据
        setTableData(
          result.data.map((item) => ({
            timestamp: new Date(item.timestamp).toLocaleString(),
            device: deviceName,
            property: propertyName,
            value: item.value,
          })),
        )
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
        const datasets = []
        const tableRows = []

        // 获取所有时间戳
        const allTimestamps = new Set()
        Object.values(result.data).forEach((series) => {
          series.forEach((point) => {
            allTimestamps.add(point.timestamp)
          })
        })

        // 排序时间戳
        const sortedTimestamps = Array.from(allTimestamps).sort()

        // 为每个查询创建数据集
        Object.entries(result.data).forEach(([label, series], index) => {
          // 为图表创建数据集
          datasets.push({
            label,
            data: series.map((item) => item.value),
            borderColor: getColorByIndex(index),
            tension: 0.1,
          })

          // 为表格创建行
          series.forEach((point) => {
            tableRows.push({
              timestamp: new Date(point.timestamp).toLocaleString(),
              device: label.split(' - ')[0],
              property: label.split(' - ')[1],
              value: point.value,
            })
          })
        })

        // 设置图表数据
        setChartData({
          labels: sortedTimestamps.map((ts) => new Date(ts).toLocaleString()),
          datasets,
        })

        // 设置表格数据（按时间排序）
        setTableData(tableRows.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)))
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
  const getColorByIndex = (index) => {
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">单设备查询</TabsTrigger>
          <TabsTrigger value="compare">多设备对比</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle>单设备属性查询</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="device">设备</Label>
                  <Select value={selectedDevice} onValueChange={handleDeviceChange}>
                    <SelectTrigger id="device">
                      <SelectValue placeholder="选择设备" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.map((device) => (
                        <SelectItem key={device.device_id} value={device.device_id}>
                          {device.device_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property">属性</Label>
                  <Select value={selectedProperty} onValueChange={setSelectedProperty} disabled={!selectedDevice}>
                    <SelectTrigger id="property">
                      <SelectValue placeholder="选择属性" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties[selectedDevice]?.map((prop) => (
                        <SelectItem key={prop.property_id} value={prop.property_id}>
                          {prop.property_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">开始时间</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">结束时间</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleSingleQuery} disabled={loading} className="w-full">
                {loading ? '查询中...' : '查询'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare">
          <Card>
            <CardHeader>
              <CardTitle>多设备对比查询</CardTitle>
            </CardHeader>
            <CardContent>
              {compareQueries.map((query, index) => (
                <div key={query.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                  <div className="space-y-2">
                    <Label>设备 {index + 1}</Label>
                    <Select value={query.deviceId} onValueChange={(value) => handleCompareDeviceChange(index, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择设备" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.map((device) => (
                          <SelectItem key={device.device_id} value={device.device_id}>
                            {device.device_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>属性</Label>
                    <Select
                      value={query.propertyId}
                      onValueChange={(value) => {
                        const updated = [...compareQueries]
                        updated[index].propertyId = value
                        setCompareQueries(updated)
                      }}
                      disabled={!query.deviceId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择属性" />
                      </SelectTrigger>
                      <SelectContent>
                        {properties[query.deviceId]?.map((prop) => (
                          <SelectItem key={prop.property_id} value={prop.property_id}>
                            {prop.property_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCompareItem(query.id)}
                      disabled={compareQueries.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between mb-4">
                <Button variant="outline" size="sm" onClick={addCompareItem} className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  添加对比项
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="compareStartTime">开始时间</Label>
                  <Input
                    id="compareStartTime"
                    type="datetime-local"
                    value={compareStartTime}
                    onChange={(e) => setCompareStartTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compareEndTime">结束时间</Label>
                  <Input
                    id="compareEndTime"
                    type="datetime-local"
                    value={compareEndTime}
                    onChange={(e) => setCompareEndTime(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleCompareQuery} disabled={loading} className="w-full">
                {loading ? '查询中...' : '查询'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {chartData && (
        <div className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>查询结果</CardTitle>
              <Button variant="outline" size="sm" onClick={exportToCSV} className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                导出CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">图表展示</h3>
                <div className="h-[400px]">
                  <HistoryChart data={chartData} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">表格数据</h3>
                <HistoryTable data={tableData} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
