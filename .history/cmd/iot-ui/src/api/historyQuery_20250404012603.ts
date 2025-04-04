import { httpRequest } from '@/utils/request'

interface HistoryQueryParams {
  deviceId: string
  properties: string[] // 改为支持多属性
  startTime: string
  endTime: string
  page?: number // 添加分页参数
  pageSize?: number
}

interface CompareQueryParams {
  devices: Array<{
    deviceId: string
    properties: string[] // 每个设备支持多属性
  }>
  startTime: string
  endTime: string
  page?: number
  pageSize?: number
}

// 查询设备历史数据
export const queryDeviceHistory = async (params: HistoryQueryParams) => {
  return httpRequest({
    url: '/api/v1/history/query',
    method: 'post',
    data: ((() => {
      if (params.properties.length > 0) {
        return { ...params, property: params.properties[0] }
      }
      return params
    }))()  // 修改为这种形式既符合ESLint规范又可保持语法正确
  })
}

// 查询多设备对比数据
export const queryCompareHistory = async (params: CompareQueryParams) => {
  // 转换数据结构以兼容旧版API
  const compatibleParams = {
    ...params,
    devices: params.devices.map(device => ({
      deviceId: device.deviceId,
      property: device.properties[0] || '', // 取第一个属性
    })),
  }
  
  return httpRequest({
    url: '/api/v1/history/compare',
    method: 'post',
    data: compatibleParams,
  })
}
