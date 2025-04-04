import { httpRequest } from '@/utils/request'
import type {
  HistoryQueryParams,
  HistoryQueryResponse,
  HistoryDataPoint,
  DeviceListResponse,
  SensorTypeResponse,
} from '@/types/history'

function isWrappedResponse(
  res: HistoryQueryResponse
): res is { data: { list: HistoryDataPoint[]; page: number; page_size: number } } {
  return !Array.isArray(res) && 'data' in res && 'list' in res.data
}

// 查询历史数据
export const queryHistoryData = async (params: HistoryQueryParams) => {
  const response = await httpRequest<HistoryQueryResponse>({
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
  return response.data
}

// 获取设备列表
export const getHistoryDevices = async () => {
  const response = await httpRequest<DeviceListResponse>({
        value: item.value,
      })),
    },
  }
}

export const queryCompareHistory = async (params: {
  devices: Array<{
    deviceId: string
    properties: string[]
  }>
  startTime: string
  endTime: string
}) => {
  const promises = params.devices.map(device =>
    queryDeviceHistory({
      deviceId: device.deviceId,
      properties: device.properties,
      startTime: params.startTime,
      endTime: params.endTime,
    })
  )
  const results = await Promise.all(promises)
  return {
    data: results.map(res => res.data),
  }
}
