import { httpRequest } from '@/utils/request'
import type {
  HistoryQueryParams,
  HistoryQueryResponse,
  HistoryDataPoint,
  DeviceListResponse,
  SensorTypeResponse,
} from '@/types/history'

function isWrappedResponse (
  res: HistoryQueryResponse | undefined | null,
): res is { data: { list: HistoryDataPoint[]; page: number; page_size: number } } {
  return !!res && !Array.isArray(res) && 'data' in res && res.data && 'list' in res.data
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
    url: '/api/v1/history/devices',
    method: 'get',
  })
  return response.data
}

// 获取传感器类型列表
export const getHistorySensorTypes = async () => {
  const response = await httpRequest<SensorTypeResponse>({
    url: '/api/v1/history/sensor-types',
    method: 'get',
  })
  return response.data
}

// 兼容旧版API
export const queryDeviceHistory = async (params: {
  deviceId: string
  properties: string[]
  startTime: string
  endTime: string
}) => {
  try {
    const res = await queryHistoryData({
      device_id: params.deviceId,
      sensor_type: params.properties[0] || '',
      start_time: params.startTime,
      end_time: params.endTime,
    })

    if (!res) {
      throw new Error('No response data')
    }

    const dataPoints = isWrappedResponse(res)
      ? res.data?.list || []
      : Array.isArray(res) ? res : []

    return {
      data: {
        deviceId: params.deviceId,
        deviceName: `Device ${params.deviceId}`,
        property: params.properties[0] || '',
        data: dataPoints
          .filter((item: any) => item && item.timestamp && item.value !== undefined)
          .map((item: HistoryDataPoint) => ({
            timestamp: item.timestamp,
            value: item.value,
          })),
      },
    }
  } catch (error) {
    console.error('Query device history failed:', error)
    return {
      data: {
        deviceId: params.deviceId,
        deviceName: `Device ${params.deviceId}`,
        property: params.properties[0] || '',
        data: [],
      },
    }
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
  try {
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
  } catch (error) {
    console.error('Query compare history failed:', error)
    return {
      data: params.devices.map(device => ({
        deviceId: device.deviceId,
        deviceName: `Device ${device.deviceId}`,
        property: device.properties[0] || '',
        data: [],
      })),
    }
  }
