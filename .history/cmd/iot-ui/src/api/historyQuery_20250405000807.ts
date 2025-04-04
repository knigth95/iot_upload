import { httpRequest } from '@/utils/request'
import type {
  HistoryQueryParams,
  HistoryQueryResponse,
  DeviceListResponse,
  SensorTypeResponse,
} from '@/types/history'

// 查询历史数据
export const queryHistoryData = async (params: HistoryQueryParams) => {
  return httpRequest<HistoryQueryResponse>({
    url: '/api/v1/history/data',
    method: 'get',
    params: {
      start_time: params.start_time,
// 兼容旧版API
export const queryDeviceHistory = async (params: {
  deviceId: string
  properties: string[]
  startTime: string
  endTime: string
}) => {
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
      data: res.data.list.map((item: { timestamp: string; value: number }) => ({
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
