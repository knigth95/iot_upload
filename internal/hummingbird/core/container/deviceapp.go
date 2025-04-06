package container

import (
	interfaces "iot_pj/internal/hummingbird/core/interface"
	"iot_pj/internal/pkg/di"
)

// DeviceApplicationName 设备应用服务名称
var DeviceApplicationName = di.TypeInstanceToName((*interfaces.DeviceApplication)(nil))

// DeviceApplicationFrom 获取设备应用服务实例
func DeviceApplicationFrom(get di.Get) interfaces.DeviceApplication {
	return get(DeviceApplicationName).(interfaces.DeviceApplication)
}
