export interface HistoryDataPoint {
  id: number
  timestamp: string
  device_id: string
  sensor_type: string
  value: number
  status: 'normal' | 'warning' | 'error'
  page?: number
  page_size?: number
}

// 修改为直接返回数组
export interface HistoryQueryResponse {
  data: HistoryDataPoint[]
  page: number
  page_size: number
  total?: number
}

export interface DeviceListResponse {
  devices: string[]
}

export interface SensorTypeResponse {
  sensor_types: string[]
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
  }[]
}
