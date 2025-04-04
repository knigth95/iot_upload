import { httpRequest } from '@/utils/request'
import type {
  HistoryQueryParams,
  HistoryQueryResponse,
  DeviceListResponse,
  SensorTypeResponse,
  HistoryDataPoint,
} from '@/types/history'

// 查询历史数据
export const queryHistoryData = async (params: HistoryQueryParams) => {
  return httpRequest<HistoryQueryResponse>({
    url: '/api/v1/history/data',
    method: 'get',
    params: {
      start_time: params.start_time,
      end_time: params.end_time,
      device_id: params.device_id,
      sensor_type: params.sensor_type,
      page: params.page || 1,
      page_size: params.page_size || 100,
    },
  })
}

// 获取设备列表
export const getHistoryDevices = async () => {
  return httpRequest<DeviceListResponse>({
    url: '/api/v1/history/devices',
    method: 'get',
  })
}

// 获取传感器类型列表
export const getHistorySensorTypes = async () => {
  return httpRequest<SensorTypeResponse>({
    url: '/api/v1/history/sensor-types',
    method: 'get',
  })
}

}
