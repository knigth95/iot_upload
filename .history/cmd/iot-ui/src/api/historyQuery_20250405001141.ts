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
// 兼容旧版API
export const queryDeviceHistory = async (params: {
  deviceId: string
  properties: string[]
  startTime: string
  endTime: string
}): Promise<{data: {
  deviceId: string
  deviceName: string
  property: string
  data: Array<{timestamp: string; value: number}>
}}> => {
  const res = await queryHistoryData({
    device_id: params.deviceId,
    sensor_type: params.properties[0],
    start_time: params.startTime,
    end_time: params.endTime,
  })
  return {
    data: {
      deviceId: params.deviceId,
      deviceName: `Device ${params.deviceId}`,
      property: params.properties[0],
      data: Array.isArray(res.data)
        ? res.data.map((item: HistoryDataPoint) => ({
            timestamp: item.timestamp,
            value: item.value,
          }))
        : res.data.list.map((item: HistoryDataPoint) => ({
            timestamp: item.timestamp,
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
    }),
  )
  const results = await Promise.all(promises)
  return {
    data: results.map(res => res.data),
  }
}
