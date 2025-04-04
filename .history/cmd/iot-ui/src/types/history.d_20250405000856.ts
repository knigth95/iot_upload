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
