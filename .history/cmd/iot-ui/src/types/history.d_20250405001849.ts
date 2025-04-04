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

export interface HistoryQueryDataWrapper {
  list: HistoryDataPoint[]
  page: number
  page_size: number
  total?: number
}

/**
 * 支持两种返回格式：
 * 1. 包装格式 { data: { list: [...] } }
 * 2. 直接数组格式 [...]
 */
export type HistoryQueryResponse = 
  | { data: HistoryQueryDataWrapper }
  | HistoryDataPoint[]

export interface DeviceListResponse {
  devices: string[]
}

export interface SensorTypeResponse {
  sensor_types: string[]
}
