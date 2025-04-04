'use server'

// Mock data for devices
const mockDevices = [
  { device_id: 'dev1', device_name: '温度传感器1' },
  { device_id: 'dev2', device_name: '温度传感器2' },
  { device_id: 'dev3', device_name: '湿度传感器1' },
  { device_id: 'dev4', device_name: '光照传感器1' },
  { device_id: 'dev5', device_name: '门窗传感器1' },
]

// Mock data for device properties
const mockProperties = {
  dev1: [
    { property_id: 'prop1', property_name: '温度' },
    { property_id: 'prop2', property_name: '电池电量' },
  ],
  dev2: [
    { property_id: 'prop1', property_name: '温度' },
    { property_id: 'prop2', property_name: '电池电量' },
  ],
  dev3: [
    { property_id: 'prop3', property_name: '湿度' },
    { property_id: 'prop2', property_name: '电池电量' },
  ],
  dev4: [
    { property_id: 'prop4', property_name: '光照强度' },
    { property_id: 'prop2', property_name: '电池电量' },
  ],
  dev5: [
    { property_id: 'prop5', property_name: '开关状态' },
    { property_id: 'prop2', property_name: '电池电量' },
  ],
}

// Generate mock historical data
function generateMockHistoricalData (
  startTime: string,
  endTime: string,
  min: number,
  max: number,
  count: number
) {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  const step = (end - start) / count

  return Array.from({ length: count }, (_, i) => {
    const timestamp = new Date(start + step * i).toISOString()
    const value = (Math.random() * (max - min) + min).toFixed(2)
    return { timestamp, value: Number.parseFloat(value) }
  })
}

// Mock linkage logs
const mockLinkageLogs = [
  {
    log_id: 1,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    event_type: '温度触发',
    description: '温度超过30度，触发空调开启',
    trigger_device: '温度传感器1',
    target_device: '空调1',
  },
  {
    log_id: 2,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    event_type: '光照触发',
    description: '光照强度低于100lux，触发灯光开启',
    trigger_device: '光照传感器1',
    target_device: '灯光1',
  },
  {
    log_id: 3,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    event_type: '门窗触发',
    description: '门窗打开，触发安防系统',
    trigger_device: '门窗传感器1',
    target_device: '安防系统',
  },
]

// 获取设备列表
export async function getDeviceList () {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { success: true, data: mockDevices }
}

// 获取设备属性列表
export async function getDeviceProperties (deviceId: string) {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (mockProperties[deviceId]) {
    return { success: true, data: mockProperties[deviceId] }
  }

  return { success: false, error: '获取设备属性失败' }
}

// 查询单个设备属性的历史数据
export async function queryDevicePropertyHistory (
  deviceId: string,
  propertyId: string,
  startTime: string,
  endTime: string,
) {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800))

  // 根据属性ID生成不同范围的模拟数据
  let min = 0
  let max = 100

  if (propertyId === 'prop1') {
    // 温度
    min = 18
    max = 35
  } else if (propertyId === 'prop2') {
    // 电池电量
    min = 60
    max = 100
  } else if (propertyId === 'prop3') {
    // 湿度
    min = 30
    max = 90
  } else if (propertyId === 'prop4') {
    // 光照强度
    min = 0
    max = 1000
  } else if (propertyId === 'prop5') {
    // 开关状态
    min = 0
    max = 1
  }

  const data = generateMockHistoricalData(startTime, endTime, min, max, 50)

  return { success: true, data }
}

// 查询多个设备属性的历史数据（用于对比）
export async function queryMultipleDeviceProperties (
  queries: Array<{
    deviceId: string
    propertyId: string
    label: string
  }>,
  startTime: string,
  endTime: string,
) {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const results: any = {}

  for (const query of queries) {
    // 根据属性ID生成不同范围的模拟数据
    let min = 0
    let max = 100

    if (query.propertyId === 'prop1') {
      // 温度
      min = 18
      max = 35
    } else if (query.propertyId === 'prop2') {
      // 电池电量
      min = 60
      max = 100
    } else if (query.propertyId === 'prop3') {
      // 湿度
      min = 30
      max = 90
    } else if (query.propertyId === 'prop4') {
      // 光照强度
      min = 0
      max = 1000
    } else if (query.propertyId === 'prop5') {
      // 开关状态
      min = 0
      max = 1
    }

    results[query.label] = generateMockHistoricalData(startTime, endTime, min, max, 50)
  }

  return { success: true, data: results }
}

// 获取设备联动日志
export async function getDeviceLinkageLogs (hours = 48) {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true, data: mockLinkageLogs }
}
