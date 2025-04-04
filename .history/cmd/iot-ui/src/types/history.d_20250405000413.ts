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

export interface HistoryQueryResponse {
  data: HistoryDataPoint[]
  page: number
  page_size: number
  total?: number
}

