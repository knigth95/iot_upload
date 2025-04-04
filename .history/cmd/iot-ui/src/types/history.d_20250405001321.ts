export interface HistoryDataPoint {
  id: number
  timestamp: string
  device_id: string
  sensor_type: string
  value: number
  status: 'normal' | 'warning' | 'error'
}

export interface HistoryQueryParams {
  start_time?: string
  end_time?: string
  device_id?: string
  sensor_type?: string
  page?: number
  page_size?: number
}

export type HistoryQueryResponse = {
  success: boolean
  code: number
  message?: string
  
  data: {
    list: HistoryDataPoint[]
    page: number
    page_size: number
    total?: number
  }
  
  // 允许直接返回数组的遗留格式
  } | HistoryDataPoint[]

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
