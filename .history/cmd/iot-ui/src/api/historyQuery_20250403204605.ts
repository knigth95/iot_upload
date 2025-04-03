import { httpRequest } from '@/utils/request'

interface HistoryQueryParams {
  deviceId: string
  property: string
  startTime: string
  endTime: string
}

interface CompareQueryParams {
  devices: Array<{
    deviceId: string
    property: string
  }>
  startTime: string
  endTime: string
}


// 查询设备历史数据
export const queryDeviceHistory = async (params: HistoryQueryParams) => {
  return httpRequest({
    url: '/api/v1/history/query',
    method: 'post',
    data: params,
  })
}

// 查询多设备对比数据
export const queryCompareHistory = async (params: CompareQueryParams) => {
  return httpRequest({
    url: '/api/v1/history/compare',
    method: 'post',
    data: params,
  })
}
