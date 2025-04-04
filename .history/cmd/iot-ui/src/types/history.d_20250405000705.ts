export interface HistoryDataPoint {
  id: number
  timestamp: string
  device_id: string
  sensor_type: string
  value: number
  status: 'normal' | 'warning' | 'error'
}

export interface HistoryQueryParams {
    total?: number
  }
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
